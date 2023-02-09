const {Router}=require('express');
const router=Router();

router.get('/', (req, res)=>{
    res.send('Hola jose');
});


module.exports = router;