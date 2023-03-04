const mongose = require('mongoose');
require('dotenv').config();

mongose.set('strictQuery', false);


mongose.connect(process.env.mongodburi)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err))




