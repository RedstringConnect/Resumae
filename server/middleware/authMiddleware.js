import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        // Try to use environment variable or default credentials
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            // For development, you can use application default credentials
            admin.initializeApp();
        }
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}

/**
 * Middleware to verify Firebase ID token
 * Expects token in Authorization header: "Bearer <token>"
 */
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authentication token provided',
            });
        }

        const token = authHeader.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token format',
            });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user info to request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token has expired',
            });
        }

        if (error.code === 'auth/argument-error') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token',
            });
        }

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Failed to authenticate token',
        });
    }
};

/**
 * Middleware to verify user owns the resource
 * Checks if the authenticated user's UID matches the userId in the request
 */
export const verifyOwnership = (req, res, next) => {
    const { userId } = req.params;
    const { uid } = req.user;

    if (userId && userId !== uid) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'You do not have permission to access this resource',
        });
    }

    next();
};
