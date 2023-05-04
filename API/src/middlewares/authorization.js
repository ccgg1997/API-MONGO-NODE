const jwt = require('jsonwebtoken');
const config = require('../config');
const userSchema = require('../models/user.schema');
const {Role} = require('../models/roles.schema');
/**
 * funcion que verifica el token de acceso
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Status 403 si no hay token
 * @returns Status 401 si el token no es valido
 */
const verifyToken = async (req, res, next) => {
    try {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided!' });
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    const user = await userSchema.findById(req.userId, { password: 0 });
    if(!user) return res.status(404).send({ message: 'No user found!' });
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

/**
 * funcion que verifica si el usuario es administrador
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const isModerator = async (req, res, next) => {
   const user = await userSchema.findById(req.userId, { password: 0 })
   const roles = await Role.find({id:{$in:user.roles}})
    for(let i=0;i<roles.length;i++){
        if(roles[i].name === 'moderator'){
            next();
            return;
        }
    }
    return res.status(403).json({message:"Require Moderator Role!"})


};

/**
 * funcion que verifica si el usuario es administrador
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAdmin = async (req, res, next) => {
    const user = await userSchema.findById(req.userId, { password: 0 })
    const roles = await Role.find({id:{$in:user.roles}})
     for(let i=0;i<roles.length;i++){
         if(roles[i].name === 'admin'){
             next();
             return;
         }
     }
     return res.status(403).json({message:"Require admin Role!"})
 
};

module.exports = {verifyToken,isModerator,isAdmin};