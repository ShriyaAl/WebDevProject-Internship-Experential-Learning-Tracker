const supabase = require('../config/db');

// @desc    Create or update incharge profile
// @route   POST /api/incharge/profile
// @access  Private (Incharge Only)
exports.upsertProfile = async (req, res) => {
    try {
        const { full_name, designation, phone } = req.body;
        const userId = req.user.id;

        if (!full_name) {
            return res.status(400).json({ success: false, error: 'full_name is required' });
        }

        const { data, error } = await supabase
            .from('incharge_profiles')
            .upsert({ user_id: userId, full_name, designation, phone }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Incharge Upsert Profile Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get dashboard metrics and pending requests
// @route   GET /api/incharge/dashboard
// @access  Private (Incharge Only)
exports.getDashboard = async (req, res) => {
    try {
        const { status } = req.query; // Optional filter

        let query = supabase
            .from('document_requests')
            .select(`
                id, status, created_at,
                request_types (name, code),
                internships (company_name, role_title),
                student_profiles (full_name, reg_no, dept, year)
            `)
            .order('created_at', { ascending: false });

        if (status && status !== 'ALL') {
            query = query.eq('status', status);
        }

        const { data: requests, error } = await query;

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        // Aggregate some basic metrics
        const metrics = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'PENDING').length,
            approved: requests.filter(r => r.status === 'APPROVED').length,
            on_hold: requests.filter(r => r.status === 'ON_HOLD').length
        }

        res.status(200).json({ success: true, metrics, data: requests });
    } catch (err) {
        console.error('Incharge Dashboard Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update request status (Approve, Reject, or put On Hold)
// @route   PUT /api/incharge/requests/:id/status
// @access  Private (Incharge Only)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, incharge_comment } = req.body;
        const userId = req.user.id; // The Incharge ID

        if (!['APPROVED', 'REJECTED', 'ON_HOLD'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status update' });
        }

        // 1. Get current status to log history
        const { data: currentReq, error: fetchErr } = await supabase
            .from('document_requests')
            .select('status')
            .eq('id', id)
            .single();

        if (fetchErr || !currentReq) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        if (currentReq.status === status) {
            return res.status(400).json({ success: false, error: `Request is already ${status}` });
        }

        // 2. Update the main request
        const { data: updatedReq, error: upError } = await supabase
            .from('document_requests')
            .update({
                status,
                incharge_comment,
                reviewed_by: userId,
                reviewed_at: new Date(),
                updated_at: new Date()
            })
            .eq('id', id)
            .select()
            .single();

        if (upError) {
            return res.status(400).json({ success: false, error: upError.message });
        }

        // 3. Log History
        await supabase.from('request_status_history').insert([{
            request_id: id,
            from_status: currentReq.status,
            to_status: status,
            comment: incharge_comment,
            changed_by: userId
        }]);

        // 4. Activity Log
        await supabase.from('activity_logs').insert([{
            actor_user_id: userId,
            action: `UPDATED_REQUEST_STATUS_${status}`,
            entity_type: 'request',
            entity_id: id
        }]);

        res.status(200).json({ success: true, data: updatedReq });

    } catch (err) {
        console.error('Update Request Status Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc    Get all internships for verification
// @route   GET /api/incharge/internships
// @access  Private (Incharge Only)
exports.getInternships = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                student_profiles (
                    full_name, reg_no, dept, year
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
        console.error('Get Internships Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Verify or Reject an internship document submission
// @route   PUT /api/incharge/internships/:id/verify
// @access  Private (Incharge Only)
exports.verifyInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const { verification_status } = req.body;
        const userId = req.user.id; // The Incharge ID

        if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(verification_status)) {
            return res.status(400).json({ success: false, error: 'Invalid verification status' });
        }

        // Update the internship
        const { data: updatedInternship, error } = await supabase
            .from('internships')
            .update({ verification_status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        // Log the activity
        await supabase.from('activity_logs').insert([{
            actor_user_id: userId,
            action: `INTERNSHIP_${verification_status}`,
            entity_type: 'internship',
            entity_id: id
        }]);

        res.status(200).json({ success: true, data: updatedInternship });
    } catch (err) {
        console.error('Verify Internship Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
