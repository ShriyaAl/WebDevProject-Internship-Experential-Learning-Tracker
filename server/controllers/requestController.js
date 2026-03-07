const supabase = require('../config/db');

// @desc    Create a new document request
// @route   POST /api/requests
// @access  Private (Student Only)
exports.createRequest = async (req, res) => {
    try {
        const { internship_id, request_type_id, payload_json, student_note } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!internship_id || !request_type_id || !payload_json) {
            return res.status(400).json({ success: false, error: 'Internship ID, Request Type, and Payload are required' });
        }

        // 1. Verify internship belongs to student
        const { data: internship, error: intError } = await supabase
            .from('internships')
            .select('id')
            .eq('id', internship_id)
            .eq('student_user_id', userId)
            .single();

        if (intError || !internship) {
            return res.status(403).json({ success: false, error: 'Unauthorized to create request for this internship' });
        }

        // 2. Insert main request
        const { data: newRequest, error: reqError } = await supabase
            .from('document_requests')
            .insert([{
                internship_id,
                student_user_id: userId,
                request_type_id,
                status: 'PENDING',
                student_note
            }])
            .select()
            .single();

        if (reqError) {
            return res.status(400).json({ success: false, error: reqError.message });
        }

        // 3. Insert initial submission payload
        const { error: subError } = await supabase
            .from('request_submissions')
            .insert([{
                request_id: newRequest.id,
                payload_json: payload_json,
                is_latest: true
            }]);

        if (subError) {
            // Rollback request if submission fails
            await supabase.from('document_requests').delete().eq('id', newRequest.id);
            return res.status(400).json({ success: false, error: 'Failed to save request payload' });
        }

        // Log Activity
        await supabase.from('activity_logs').insert([{
            actor_user_id: userId, action: 'CREATED_REQUEST', entity_type: 'request', entity_id: newRequest.id
        }]);

        res.status(201).json({ success: true, data: newRequest });

    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a request payload (Only when ON_HOLD)
// @route   PUT /api/requests/:id/resubmit
// @access  Private (Student Only)
exports.resubmitRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { payload_json, student_note } = req.body;
        const userId = req.user.id;

        if (!payload_json) {
            return res.status(400).json({ success: false, error: 'Payload json is required' });
        }

        // 1. Fetch Request to Ensure it belongs to student AND is ON_HOLD
        const { data: request, error: fetchError } = await supabase
            .from('document_requests')
            .select('id, status, student_user_id')
            .eq('id', id)
            .single();

        if (fetchError || !request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        if (request.student_user_id !== userId) {
            return res.status(403).json({ success: false, error: 'Not authorized to edit this request' });
        }

        if (request.status !== 'ON_HOLD') {
            return res.status(400).json({ success: false, error: 'You can only edit requests that are ON_HOLD' });
        }

        // 2. Mark previous submissions as NOT latest
        await supabase
            .from('request_submissions')
            .update({ is_latest: false })
            .eq('request_id', id);

        // 3. Insert new submission
        const { error: subError } = await supabase
            .from('request_submissions')
            .insert([{
                request_id: id,
                payload_json,
                is_latest: true
            }]);

        if (subError) {
            return res.status(400).json({ success: false, error: subError.message });
        }

        // 4. Update the main request back to PENDING and append new note
        const updateData = {
            status: 'PENDING',
            updated_at: new Date()
        };
        if (student_note) updateData.student_note = student_note;

        const { data: updatedReq, error: upError } = await supabase
            .from('document_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        // 5. Track Status History Change
        await supabase.from('request_status_history').insert([{
            request_id: id,
            from_status: 'ON_HOLD',
            to_status: 'PENDING',
            comment: 'Student resubmitted document',
            changed_by: userId
        }]);

        res.status(200).json({ success: true, data: updatedReq });

    } catch (error) {
        console.error('Resubmit Request Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all details of a specific request including its submission history
// @route   GET /api/requests/:id
// @access  Private (Student + Incharge)
exports.getRequestDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const { data: request, error } = await supabase
            .from('document_requests')
            .select(`
                *,
                request_types (name, code),
                internships (company_name, role_title),
                student_profiles (full_name, reg_no, dept, year),
                request_submissions (id, payload_json, submitted_at, is_latest),
                request_status_history (from_status, to_status, comment, changed_at, users(role))
           `)
            .eq('id', id)
            .single();

        if (error || !request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        // Security check for students
        if (role === 'STUDENT' && request.student_user_id !== userId) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this request' });
        }

        // Order submissions and history for easier frontend consumption
        request.request_submissions.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        request.request_status_history.sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

        res.status(200).json({ success: true, data: request });

    } catch (err) {
        console.error('Get Request Details Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc    Get all available request types mapping (For form rendering)
// @route   GET /api/requests/types/all
// @access  Private 
exports.getRequestTypes = async (req, res) => {
    const { data, error } = await supabase.from('request_types').select('*').eq('is_active', true);
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.status(200).json({ success: true, data });
}

// @desc    Get all document requests for the logged-in student
// @route   GET /api/requests/my
// @access  Private (Student Only)
exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('document_requests')
            .select(`
                id, status, student_note, incharge_comment, created_at, updated_at,
                request_types (id, name, code),
                internships (id, company_name, role_title)
            `)
            .eq('student_user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Get My Requests Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
