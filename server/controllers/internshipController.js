const supabase = require('../config/db');

// @desc    Create a new internship record for a student
// @route   POST /api/internships
// @access  Private (Student Only)
exports.createInternship = async (req, res) => {
    try {
        const { company_name, company_linkedin, role_title, expected_start_date, expected_end_date, stipend, location, mode, supporting_documents } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!company_name || !role_title) {
            return res.status(400).json({ success: false, error: 'Company name and Role title are required' });
        }

        // Insert into internships table
        const { data: internship, error } = await supabase
            .from('internships')
            .insert([
                {
                    student_user_id: userId,
                    company_name,
                    company_linkedin,
                    role_title,
                    expected_start_date,
                    expected_end_date,
                    stipend,
                    location,
                    mode,
                    supporting_documents: supporting_documents || []
                }
            ])
            .select()
            .single();

        if (error) {
            // Could fail if student_profile doesn't exist yet due to FK constraint
            if (error.code === '23503') {
                return res.status(400).json({ success: false, error: 'You must complete your Student Profile before creating an internship' });
            }
            return res.status(400).json({ success: false, error: error.message });
        }

        // Log the activity
        await supabase.from('activity_logs').insert([{
            actor_user_id: userId,
            action: 'CREATED_INTERNSHIP',
            entity_type: 'internship',
            entity_id: internship.id,
            meta_json: { company_name, role_title }
        }]);

        res.status(201).json({ success: true, data: internship });
    } catch (error) {
        console.error('Create Internship Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all internships for the logged-in student
// @route   GET /api/internships/my
// @access  Private (Student Only)
exports.getMyInternships = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                document_requests (
                     id, request_type_id, status, created_at
                )
            `)
            .eq('student_user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        console.error('Get My Internships Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get a single internship by ID (including requests connected to it)
// @route   GET /api/internships/:id
// @access  Private (Student + Incharge)
exports.getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        let query = supabase
            .from('internships')
            .select(`
                *,
                student_profiles (
                    reg_no, full_name, dept, year
                ),
                document_requests (
                    id, request_type_id, status, created_at, updated_at
                )
            `)
            .eq('id', id);

        // Security: If student, ensure they only request their own internship
        if (role === 'STUDENT') {
            query = query.eq('student_user_id', userId);
        }

        const { data, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Internship not found or unauthorized' });
            }
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Get Internship By Id Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}
