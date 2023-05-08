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
        return res.status(401).send({ message: 'Unauthorized!. Please sigIn' });
    }
};


//funcion que verifica si el usuario es administrador 
const isModerator = async (req, res, next) => {
   //obtener el token del header y sacar el rol del usuario.
   verifyToken(req,res,next);
   const token = req.headers['x-access-token'];
   if (!token) return res.status(403).send({ message: 'No token provided!' });
   const decoded = jwt.verify(token, config.SECRET);
   const roles = decoded.roles;

   //buscar dentro de los roles si es moderador
   for(let i=0;i<roles.length;i++){
       console.log("roles[i]: "+ roles[i]);
       const role = await Role.findById(roles[i]);
       console.log("roleRoleFindById: "+ role);
       const rolName = role.name;
       console.log("rolName: "+ rolName);
       if(rolName === 'moderator'){
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
    //obtener el token del header y sacar el rol del usuario
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided!' });
    const decoded = jwt.verify(token, config.SECRET);
    const roles = decoded.roles;

    //buscar dentro de los roles si es admin
    for(let i=0;i<roles.length;i++){
        console.log("roles[i]: "+ roles[i]);
        const role = await Role.findById(roles[i]);
        console.log("roleRoleFindById: "+ role);
        const rolName = role.name;
        console.log("rolName: "+ rolName);
        if(rolName === 'admin'){
            next();
            return;
        }
    }
     return res.status(403).json({message:"Require admin Role!"})
 
};

module.exports = {verifyToken,isModerator,isAdmin};