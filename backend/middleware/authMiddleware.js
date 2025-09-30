const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const authMiddleware = (req,res,next) =>{
    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith('Bearer ')){
        res.status(403).json({

        })
    }

    const token = authHeaders.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;
            next();

        }
        else{
            return res.status(403).json({})
        }
    }catch(e){
        return res.status(403).json({});
    }
}

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
module.exports = {
    authMiddleware,
    adminMiddleware
}

