import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({success:false,message:"not authorized login again"})
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        console.log(token_decode)
        if (token_decode!==process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message:error.message });
    }
}

export default adminAuth