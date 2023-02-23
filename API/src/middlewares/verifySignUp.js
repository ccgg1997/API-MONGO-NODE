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
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: `Rol ${req.body.roles[i]} doestn exist`
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
    try {
      console.log(req.body);  
      const user = await userSchema.findOne({ name: req.body.name });
      if (user) {
        return res.status(400).json({ message: "user already exists" });
      }
  
      const email = await userSchema.findOne({ email: req.body.email });
      if (email) {
        return res.status(400).json({ message: "email already exists" });
      }
  
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
module.exports = {checkRolesExisted,checkDuplicateUsernameOrEmail}