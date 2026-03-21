const supabase = require('../config/db');

// @desc    Create or update student profile
// @route   POST /api/students/profile
// @access  Private (Student Only)
exports.upsertStudentProfile = async (req, res) => {
    try {
        const { reg_no, full_name, dept, year, section, gender, phone, linkedin_url } = req.body;
        const userId = req.user.id;

        if (!reg_no || !full_name) {
            return res.status(400).json({ success: false, error: 'Registration number and full name are required' });
        }

        const payload = {
            user_id: userId,
            reg_no,
            full_name,
            dept: dept || 'IT',
            year,
            section,
            gender,
            phone,
            linkedin_url
        };

        let { data, error } = await supabase
            .from('student_profiles')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .single();

        // Compatibility fallback: if section column migration is not applied yet, retry without it.
        if (error && /section/i.test(error.message || '')) {
            const { section: _omit, ...withoutSection } = payload;
            const retry = await supabase
                .from('student_profiles')
                .upsert(withoutSection, { onConflict: 'user_id' })
                .select()
                .single();
            data = retry.data;
            error = retry.error;
        }

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Upsert Student Profile Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current student profile details (including internal metadata)
// @route   GET /api/students/profile
// @access  Private (Student Only)
exports.getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: profile, error } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned (not created yet)
            return res.status(400).json({ success: false, error: error.message });
        }

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found. Please complete registration.' });
        }

        // Merge basic user data with student profile
        const responseData = {
            ...req.user,
            profile
        };

        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error('Get Student Profile Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
