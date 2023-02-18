const { request } = require('express');
const userSchema = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('../config');
const Role = require('../models/roles.Schema');

const signUp = async (req,res)=>{
    
    createUser(req,res);
}

const signIn = async (req,res)=>{
    const userFound = await userSchema.findOne({email:req.body.email})
    if(!userFound) return res.status(400).json({message:"user not found"})

    console.log("userFound" + userFound)

    res.json('')
}

//create user
const createUser = async (req, res) => {
    try {
        
        const plainPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        const {name, email,password, cedula, roles} = req.body;
        const userData = {
            name,
            email,
            password: hashedPassword,
            cedula,
            estado: req.body.estado || true
        };
        console.log("userData" + userData)
        if(roles){
           const foundRol = await Role.find({name:{$in:roles}})
           userData.roles = foundRol.map(rol=>rol._id)
           console.log("encontro rol")
        } else{
            const role = await Role.findOne({name:"user"})
            userData.roles = [role._id]
            console.log("no encontro rol")
        }

        const user = userSchema(userData);
        const userSaved = await user.save();
        console.log("user saved" + userSaved)
        const token = jwt.sign({id:userSaved._id},config.SECRET,{expiresIn:90000})
        res.json(token);
    } catch (error) {
        res.json({ message: error });
    }
};



//get all user
const getUser = (req, res) => { 
    
    Role
        .find()
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
    //res.json({ message: ' agregado' });
};


//get oneUser
const getOneUser = (req, res) => { 
    const {id} = req.params;    
    userSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
    //res.json({ message: ' agregado' });
};


//update user
const updateUser = (req, res) => {  
    const {id} = req.params;
    const {name, email, password, rol,estado} = req.body;
    userSchema
        .updateOne({_id: id}, { $set:{name, email, password, rol,estado}})
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
};

//delete user
const deleteUser = (req, res) => {  
    const {id} = req.params;
    const auxEstado =false;
    
    userSchema
        .updateOne({_id: id}, { $set:{estado: auxEstado}})
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));

};


module.exports = {signUp,signIn,getUser, createUser,getOneUser,updateUser,deleteUser};