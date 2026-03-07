const supabase = require('../config/db');

/**
 * Middleware to verify Supabase JWT token and extract user information.
 * It also checks if the user exists and is active in our custom users table.
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
        }

        // Check custom users table for role and active status
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('id, email, role, is_active')
            .eq('id', user.id)
            .single();

        if (dbError || !dbUser) {
            return res.status(404).json({ success: false, error: 'Forbidden: User not found in database' });
        }

        if (!dbUser.is_active) {
            return res.status(403).json({ success: false, error: 'Forbidden: User account is deactivated' });
        }

        // Attach user to request object
        req.user = dbUser;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * Middleware to authorize specific roles.
 * Must be used AFTER verifyToken middleware.
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Forbidden: Requires one of these roles - ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
