const { request } = require('express');
const userSchema = require('../models/user.schema');
const bcrypt = require('bcrypt')
const saltRounds = 10;


//create user
const createUser = (req, res) => { 
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            res.json({ message: err });
        } else {
            const userData = {
                ...req.body,
                password: hashedPassword,
                estado: req.body.estado || true
            };
            const user = userSchema(userData);
            user
                .save()
                .then((data) => res.json(data))
                .catch((error) => res.json({ message: error }));
        }
    });
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