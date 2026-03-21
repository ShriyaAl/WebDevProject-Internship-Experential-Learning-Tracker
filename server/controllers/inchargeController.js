const supabase = require('../config/db');

const parseStipend = (value) => {
    if (value === null || value === undefined) return null;
    const num = Number(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : null;
};

const extractRegNumeric = (regNo) => {
    if (!regNo) return null;
    const match = String(regNo).match(/(\d+)/g);
    if (!match) return null;
    const merged = match.join('');
    const n = Number(merged);
    return Number.isFinite(n) ? n : null;
};

const includesAnyTech = (exitSurvey, techFilter) => {
    if (!techFilter) return true;
    const list = Array.isArray(exitSurvey?.tech_stack) ? exitSurvey.tech_stack : [];
    const selected = String(techFilter)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (!selected.length) return true;
    const normalized = list.map((t) => String(t).toLowerCase());
    return selected.some((t) => normalized.includes(t));
};

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
        const { status, q, type, dept, sort } = req.query; // Optional filters

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

        const { data: rawRequests, error } = await query;

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        let requests = rawRequests || [];

        if (type) {
            const typeNorm = type.toLowerCase();
            requests = requests.filter((r) =>
                r.request_types?.name?.toLowerCase().includes(typeNorm) ||
                r.request_types?.code?.toLowerCase().includes(typeNorm)
            );
        }

        if (dept) {
            const deptNorm = dept.toLowerCase();
            requests = requests.filter((r) =>
                (r.student_profiles?.dept || '').toLowerCase() === deptNorm
            );
        }

        if (q) {
            const term = q.toLowerCase().trim();
            requests = requests.filter((r) => {
                const searchable = [
                    r.student_profiles?.full_name,
                    r.student_profiles?.reg_no,
                    r.student_profiles?.dept,
                    r.request_types?.name,
                    r.request_types?.code,
                    r.internships?.company_name,
                    r.internships?.role_title,
                    r.status
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return searchable.includes(term);
            });
        }

        if (sort === 'oldest') {
            requests.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        const {
            q,
            verification_status,
            activity_status,
            mode,
            internship_type,
            map_for_credits,
            year,
            dept,
            section,
            reg_no_start,
            reg_no_end,
            company_name,
            tech_stack,
            stipend_min,
            stipend_max,
            sort
        } = req.query;

        let { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                student_profiles (
                    full_name, reg_no, dept, year, section
                )
            `)
            .order('created_at', { ascending: false });

        // Compatibility fallback if section column hasn't been migrated yet.
        if (error && /section/i.test(error.message || '')) {
            const retry = await supabase
                .from('internships')
                .select(`
                    *,
                    student_profiles (
                        full_name, reg_no, dept, year
                    )
                `)
                .order('created_at', { ascending: false });
            data = retry.data;
            error = retry.error;
        }

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        let internships = data || [];

        if (verification_status && verification_status !== 'ALL') {
            internships = internships.filter((i) => i.verification_status === verification_status);
        }
        if (activity_status && activity_status !== 'ALL') {
            internships = internships.filter((i) => i.activity_status === activity_status);
        }
        if (mode && mode !== 'ALL') {
            internships = internships.filter((i) => i.mode === mode);
        }
        if (internship_type && internship_type !== 'ALL') {
            internships = internships.filter((i) => i.internship_type === internship_type);
        }
        if (map_for_credits && map_for_credits !== 'ALL') {
            const wantCredits = map_for_credits === 'true';
            internships = internships.filter((i) => Boolean(i.map_for_credits) === wantCredits);
        }
        if (year && year !== 'ALL') {
            internships = internships.filter((i) => String(i.student_profiles?.year || '') === String(year));
        }
        if (dept && dept !== 'ALL') {
            internships = internships.filter((i) => (i.student_profiles?.dept || '').toLowerCase() === String(dept).toLowerCase());
        }
        if (section && section !== 'ALL') {
            internships = internships.filter((i) => (i.student_profiles?.section || '').toLowerCase() === String(section).toLowerCase());
        }
        if (company_name) {
            const term = String(company_name).toLowerCase().trim();
            internships = internships.filter((i) => (i.company_name || '').toLowerCase().includes(term));
        }
        if (tech_stack) {
            internships = internships.filter((i) => includesAnyTech(i.exit_survey, tech_stack));
        }
        if (stipend_min !== undefined || stipend_max !== undefined) {
            const min = stipend_min !== undefined && stipend_min !== '' ? Number(stipend_min) : null;
            const max = stipend_max !== undefined && stipend_max !== '' ? Number(stipend_max) : null;
            internships = internships.filter((i) => {
                const s = parseStipend(i.stipend);
                if (s === null) return false;
                if (min !== null && s < min) return false;
                if (max !== null && s > max) return false;
                return true;
            });
        }
        if ((reg_no_start && reg_no_start !== '') || (reg_no_end && reg_no_end !== '')) {
            const minReg = reg_no_start !== undefined && reg_no_start !== '' ? Number(reg_no_start) : null;
            const maxReg = reg_no_end !== undefined && reg_no_end !== '' ? Number(reg_no_end) : null;
            internships = internships.filter((i) => {
                const reg = extractRegNumeric(i.student_profiles?.reg_no);
                if (reg === null) return false;
                if (minReg !== null && reg < minReg) return false;
                if (maxReg !== null && reg > maxReg) return false;
                return true;
            });
        }
        if (q) {
            const term = q.toLowerCase().trim();
            internships = internships.filter((i) => {
                const searchable = [
                    i.company_name,
                    i.role_title,
                    i.mode,
                    i.internship_type,
                    i.verification_status,
                    i.activity_status,
                    i.student_profiles?.full_name,
                    i.student_profiles?.reg_no,
                    i.student_profiles?.dept,
                    i.student_profiles?.section
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return searchable.includes(term);
            });
        }

        if (sort === 'oldest') {
            internships.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            internships.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        res.status(200).json({ success: true, count: internships.length, data: internships });
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
