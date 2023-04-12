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
                    message: `Rol ${req.body.roles[i]} doesnt exist`
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
const checkDuplicateId = async (req, res, next) => {
    try {

      const id = await userSchema.findOne({ id: req.body.id });
      if (id) {
        return res.status(400).json({ message: "user already exists" });
      }
  
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
module.exports = {checkRolesExisted,checkDuplicateId}