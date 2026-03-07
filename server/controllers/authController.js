const supabase = require('../config/db');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, error: 'Please provide email, password, and role' });
        }

        if (!['STUDENT', 'INCHARGE'].includes(role)) {
            return res.status(400).json({ success: false, error: 'Invalid role specified' });
        }

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto confirm for now
        });

        if (authError) {
            console.error('[Supabase Auth CreateUser Error]:', authError);
            // 409 for duplicate emails, 500 for everything else
            const statusCode = authError.message?.toLowerCase().includes('already') ? 409 : 500;
            return res.status(statusCode).json({ success: false, error: authError.message });
        }

        const userId = authData.user.id;

        // 2. Insert into our custom public.users table
        const { error: dbError } = await supabase
            .from('users')
            .insert([
                { id: userId, email, role, is_active: true }
            ]);

        if (dbError) {
            // Rollback auth user creation if db insert fails
            await supabase.auth.admin.deleteUser(userId);
            console.error('Database user creation failed:', dbError);
            return res.status(500).json({ success: false, error: 'User registration failed on database layer' });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: userId,
                email,
                role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Login user (Frontend handles actual login, this is just for token exchange/verification if needed)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        // Attempt to sign in via Supabase
        // Note: Since we are using Service Role in the backend, we use signinWithPassword directly 
        // to verify credentials and return the session to the frontend.
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Fetch custom user details (role)
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('role, is_active')
            .eq('id', data.user.id)
            .single();

        if (dbError || !dbUser.is_active) {
            return res.status(403).json({ success: false, error: 'Account is deactivated or not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                session: data.session,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: dbUser.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // req.user is set in authMiddleware.js
    res.status(200).json({
        success: true,
        data: req.user
    });
};
