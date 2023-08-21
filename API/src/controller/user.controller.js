const { request } = require('express');
const userSchema = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('../config');
const {Role} = require('../models/roles.schema');


const signUp = async (req,res)=>{
    try{
        createUser(req,res);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const signIn = async (req,res)=>{

    try{
        //validaciones de datos 
        const userFound = await userSchema.findOne({id:req.body.id});
        if(userFound===null || userFound===undefined) return res.status(400).json({message:"user not found",token:null});
        console.log("role" + userFound.roles[0]);
        const role = userFound.roles[0];
        console.log("role: "+role);
        if(!userFound || !userFound.access) return res.status(400).json({message:"user not found or access denied",token:null});
        const CorrectPassword = await userSchema.comparePassword( req.body.password, userFound.password);
        if(!CorrectPassword) {
            return res.status(400).json({token:null,message:"invalid password or user not found"})};

        // const dateToCompare = new Date("2023-05-06");
        // const currentDate = new Date();
        // let time =currentDate.toDateString() === dateToCompare.toDateString() ? '60000000s' : '600s';
        const time = '3600s';
        
        //generar token
        const token = jwt.sign({ id: userFound._id, idUser: userFound.id, name: userFound.name, roles: role },config.SECRET,{expiresIn:time});
        const decoded = jwt.verify(token, config.SECRET);
        const expTimestamp = decoded.exp; // Obtiene el timestamp de expiración
        const exp_data = new Date(expTimestamp * 1000);
        res.json({token:token,idUser: userFound.id, name: userFound.name, roles: role,time_Exp:exp_data});
        
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

//create user
const createUser = async (req, res) => {
    try {
        
        const plainPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        const {name, email,password, id, roles} = req.body;
        const userData = {
            name,
            email,
            password: hashedPassword,
            id,
            deleted: false
        };

        if(roles){
           const foundRol = await Role.find({name:{$in:roles}})
           userData.roles = foundRol.map(rol=>rol.name)
           console.log("encontro rol")
        } else{     
            userData.roles = ["user"]
            console.log("no encontro rol")
        }

        const user = userSchema(userData);
        const userSaved = await user.save();
        console.log("user saved" + userSaved)
        //const token = jwt.sign({id:userSaved._id},config.SECRET,{expiresIn:90000})
        //res.json({token:token});
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



//get all user
const getUser = (req, res) => { 
    try{
         userSchema
        .find({deleted:false})
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
    //res.json({ message: ' agregado' });}
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error });
    }
};


//get oneUser
const getOneUser = (req, res) => { 
    try{
        const {id} = req.params;    
        userSchema
            .findOne({id:id})
            .then((data) => res.json(data))
            .catch((error)=> res.json({message: error}));
        //res.json({ message: ' agregado' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error });
    }
}; 


//update user
const updateUser = (req, res) => {  
    try{
        const {id} = req.params;
        const {name, email, password, rol,deleted,access} = req.body;
        console.log("id: "+id+" name: "+name+" email: "+email+" password: "+password+" rol: "+rol+" deleted: "+deleted+" access: "+access);
        userSchema
            .updateOne({id: id}, { $set:{name, email, password, rol,deleted,access}})
            .then((data) => res.json(data))
            .catch((error)=> res.json({message: error}));
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error });
    }
};

//delete user
const deleteUser = (req, res) => {  
    try{ 
        const {id} = req.params;
        const auxdeleted =true;
        userSchema
            .updateOne({id: id}, { $set:{deleted: auxdeleted,access: false}})
            .then((data) => res.json(data))
            .catch((error)=> res.json({message: error}));
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error });
    }

};


module.exports = {signUp,signIn,getUser, createUser,getOneUser,updateUser,deleteUser};