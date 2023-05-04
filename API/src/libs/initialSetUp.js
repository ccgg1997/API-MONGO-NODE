const {Role} = require('../models/roles.schema');

const createRoles = async () => {

  try{

  const count = await Role.estimatedDocumentCount()
    
  if(count > 0 )return ;
  
  const value = await Promise.all([
    new Role({name: 'user'}).save(),
    new Role({name: 'moderator'}).save(),
    new Role({name: 'admin'}).save(),
  ])
  
  console.log("info" + value);
}catch(error){
  console.log(error);
}


};

module.exports = {createRoles};