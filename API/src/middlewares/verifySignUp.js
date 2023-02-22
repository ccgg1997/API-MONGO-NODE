const {ROLES} = require('../models/roles.Schema');
const userSchema = require('../models/user.schema');

/**
 * funcion que verifica si el rol existe
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const checkRolesExisted = (req, res, next) => {
    if (req.body.rol) {
        for (let i = 0; i < req.body.rol.length; i++) {
            if (!ROLES.includes(req.body.rol[i])) {
                return res.status(400).json({
                    message: `Rol ${req.body.rol[i]} doestn exist`
                })
            }
        }
    }
    next();
}

/**
 * funcion que verifica si el usuario ya existe
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const checkDuplicateUsernameOrEmail = async (req, res, next) => {

  const user = userSchema.findOne({name: req.body.name})

  if(user) return res.status(400).json({message:"user already exist"});

  const email= userSchema.findOne({email: req.body.email})

  if(email) return res.status(400).json({message:"email already exist"});

  next();
}

module.exports = {checkRolesExisted,checkDuplicateUsernameOrEmail}