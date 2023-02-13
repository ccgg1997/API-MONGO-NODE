const {Router}=require('express');
const router=Router();
const{createUser,getUser,getOneUser,updateUser,deleteUser}=require('../controller/user.controller');

//create usario

router.post('/', createUser); 

router.get('/', getUser);
router.get('/:id', getOneUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


module.exports = router;