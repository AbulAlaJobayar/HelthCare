import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

export const generateToken=(payload:any,secret:Secret,expiresIn:string)=>{
return jwt.sign(payload,secret,{ algorithm:'HS256',expiresIn})
}

export const verifyToken=(token:string,secret:Secret)=>{
    return jwt.verify(token,secret)as JwtPayload    
}