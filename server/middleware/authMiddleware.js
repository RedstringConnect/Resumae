import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        // Check if we have a service account JSON string in environment
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id,
            });
            console.log('✅ Firebase Admin initialized with service account');
        } else if (process.env.FIREBASE_PROJECT_ID) {
            // Use individual environment variables
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                projectId: process.env.FIREBASE_PROJECT_ID,
            });
            console.log('✅ Firebase Admin initialized with environment variables');
        } else {
            // Development mode - skip Firebase Admin verification
            console.warn('⚠️ Firebase Admin not configured. Using development mode (no auth verification)');
        }
    } catch (error) {
        console.error('❌ Firebase admin initialization error:', error.message);
        console.warn('⚠️ Continuing in development mode without Firebase Admin');
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

        // Check if Firebase Admin is properly initialized
        if (!admin.apps.length) {
            // Development mode - extract UID from token without verification
            console.warn('⚠️ Development mode: Skipping token verification');
            try {
                // Decode token (NOT verifying signature - for development only!)
                const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
                req.user = {
                    uid: payload.user_id || payload.sub,
                    email: payload.email,
                };
                return next();
            } catch (decodeError) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Invalid token',
                });
            }
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
