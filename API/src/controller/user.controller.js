const { request } = require('express');
const userSchema = require('../models/user.schema');



//create user
const createUser = (req, res) => { 
    const userData = {
        ...req.body,
        estado:req.body.estado || true
      };
    const user = userSchema(userData);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
    //res.json({ message: ' agregado' });
};


//get all user
const getUser = (req, res) => { 
    
    userSchema
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


module.exports = {getUser, createUser,getOneUser,updateUser,deleteUser};