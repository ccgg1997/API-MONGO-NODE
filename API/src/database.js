const mongose = require('mongoose');

mongose.connect('mongodb://mongo/mydatabase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err))

mongose.set('strictQuery', false);

