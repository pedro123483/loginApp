import jwt from 'jsonwebtoken';

async function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
        const user = await decodedToken;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};

export default auth;