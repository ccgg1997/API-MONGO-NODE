const {Router}=require('express');
const router=Router();
const{signUp,signIn,createUser,getUser,getOneUser,updateUser,deleteUser}=require('../controller/user.controller');
const {verifySignUp,authJwt}=require('../middlewares');
//create user
router.post('/signup',
[verifySignUp.checkDuplicateId,verifySignUp.checkRolesExisted],
signUp);
router.post('/signin',signIn);
//router.post('/', createUser); 

router.get('/', getUser);
router.get('/:id', getOneUser);

router.put('/:id' ,updateUser);

router.delete('/:id',[authJwt.verifyToken,authJwt.isAdmin], deleteUser);


module.exports = router;