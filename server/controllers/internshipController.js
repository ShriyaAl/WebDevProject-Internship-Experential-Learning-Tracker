const supabase = require('../config/db');

const ALLOWED_MODES = ['ONSITE', 'REMOTE', 'HYBRID'];
const ALLOWED_ACTIVITY_STATUS = ['Ongoing', 'Completed'];

const normalizeOfferLetterReceived = (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'yes' || normalized === 'true') return true;
        if (normalized === 'no' || normalized === 'false') return false;
    }
    return undefined;
};

const isValidSupportingDocuments = (docs) => {
    if (!Array.isArray(docs) || docs.length === 0) return false;
    return docs.every((doc) =>
        doc &&
        typeof doc === 'object' &&
        typeof doc.name === 'string' &&
        doc.name.trim() &&
        typeof doc.url === 'string' &&
        doc.url.trim()
    );
};

const normalizeSurveyPayload = (survey) => {
    if (!survey || typeof survey !== 'object' || Array.isArray(survey)) return null;

    const {
        tech_stack,
        project_summary,
        roles_skills,
        industry_mentors,
        learning_rating
    } = survey;

    if (!Array.isArray(tech_stack)) return null;
    if (typeof project_summary !== 'string') return null;
    if (typeof roles_skills !== 'string') return null;
    if (typeof industry_mentors !== 'string') return null;
    if (!Number.isInteger(learning_rating) || learning_rating < 1 || learning_rating > 10) return null;
    if (!tech_stack.every((item) => typeof item === 'string')) return null;

    return {
        tech_stack,
        project_summary,
        roles_skills,
        industry_mentors,
        learning_rating
    };
};

// @desc    Create a new internship record for a student
// @route   POST /api/internships
// @access  Private (Student Only)
exports.createInternship = async (req, res) => {
    try {
        const {
            company_name,
            company_linkedin,
            role_title,
            expected_start_date,
            expected_end_date,
            stipend,
            location,
            mode,
            supporting_documents,
            internship_type,
            map_for_credits,
            offer_letter_received,
            reporting_authority_name,
            reporting_authority_designation,
            reporting_authority_email,
            reporting_authority_phone,
            reporting_xx1,
            reporting_xx2,
            reporting_xx3,
            reporting_xx4
        } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!company_name || !role_title || !expected_start_date || !expected_end_date || !mode || !internship_type) {
            return res.status(400).json({
                success: false,
                error: 'company_name, role_title, expected_start_date, expected_end_date, mode and internship_type are required'
            });
        }

        if (!ALLOWED_MODES.includes(mode)) {
            return res.status(400).json({ success: false, error: `Invalid mode. Allowed values: ${ALLOWED_MODES.join(', ')}` });
        }

        if (!isValidSupportingDocuments(supporting_documents)) {
            return res.status(400).json({
                success: false,
                error: 'supporting_documents is required and must contain at least one { name, url } object'
            });
        }

        const normalizedOfferLetterReceived = normalizeOfferLetterReceived(offer_letter_received);
        if (normalizedOfferLetterReceived === undefined) {
            return res.status(400).json({
                success: false,
                error: 'offer_letter_received must be Yes/No, true/false, or omitted'
            });
        }

        const normalizedMapForCredits = map_for_credits === undefined ? false : Boolean(map_for_credits);

        // Backward compatibility for existing frontend payload keys.
        const resolvedReportingAuthorityName = reporting_authority_name || reporting_xx1 || null;
        const resolvedReportingAuthorityDesignation = reporting_authority_designation || reporting_xx2 || null;
        const resolvedReportingAuthorityEmail = reporting_authority_email || reporting_xx3 || null;
        const resolvedReportingAuthorityPhone = reporting_authority_phone || reporting_xx4 || null;

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
                    supporting_documents,
                    internship_type,
                    map_for_credits: normalizedMapForCredits,
                    offer_letter_received: normalizedOfferLetterReceived,
                    reporting_authority_name: resolvedReportingAuthorityName,
                    reporting_authority_designation: resolvedReportingAuthorityDesignation,
                    reporting_authority_email: resolvedReportingAuthorityEmail,
                    reporting_authority_phone: resolvedReportingAuthorityPhone
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

// @desc    Update internship supporting documents for the logged-in student
// @route   PATCH /api/internships/:id/documents
// @access  Private (Student Only)
exports.updateInternshipDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { supporting_documents } = req.body;

        if (!Array.isArray(supporting_documents)) {
            return res.status(400).json({ success: false, error: 'supporting_documents must be an array' });
        }

        if (supporting_documents.length > 0 && !isValidSupportingDocuments(supporting_documents)) {
            return res.status(400).json({
                success: false,
                error: 'Each supporting document must be an object with non-empty name and url'
            });
        }

        const { data, error } = await supabase
            .from('internships')
            .update({
                supporting_documents,
                updated_at: new Date()
            })
            .eq('id', id)
            .eq('student_user_id', userId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Internship not found or unauthorized' });
            }
            return res.status(400).json({ success: false, error: error.message });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Update Internship Documents Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Submit internship exit survey and mark completed
// @route   PATCH /api/internships/:id/exit-survey
// @access  Private (Student Only)
exports.submitExitSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const normalizedSurvey = normalizeSurveyPayload(req.body);

        if (!normalizedSurvey) {
            return res.status(400).json({
                success: false,
                error: 'Invalid exit survey payload. Expected tech_stack, project_summary, roles_skills, industry_mentors and learning_rating (1-10)'
            });
        }

        const { data, error } = await supabase
            .from('internships')
            .update({
                exit_survey: normalizedSurvey,
                activity_status: 'Completed',
                updated_at: new Date()
            })
            .eq('id', id)
            .eq('student_user_id', userId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ success: false, error: 'Internship not found or unauthorized' });
            }
            return res.status(400).json({ success: false, error: error.message });
        }

        if (!ALLOWED_ACTIVITY_STATUS.includes(data.activity_status)) {
            return res.status(400).json({ success: false, error: 'Invalid activity_status stored in database' });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Submit Exit Survey Error:', error);
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
