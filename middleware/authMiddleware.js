const admin = require("firebase-admin")

exports.authMiddleware = async(req,res,next)=> {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).send({
                message:"Unauthorized: No token provided"
            });
        }

        const token = authHeader.split(" ")[1]
        const decodedToken = await admin.auth().verifyIdToken(token)
        // console.log(decodedToken);

        req.user = decodedToken
     
        next()
        
    } catch (error) {
    //    console.log(error);
        
    }

}