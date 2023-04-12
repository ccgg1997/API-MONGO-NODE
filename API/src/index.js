const express=require('express');
///const cors = require('cors');
const app=express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const {createRoles} = require('./libs/initialSetUp');
createRoles();
const {swaggerDocs} = require('./swagger');
const cors = require('cors');

//importando el database
require('./database');

//settings
const port=6000;
app.set('json spaces', 2);  //to format the json    
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));   //to understand the data that the user sends
app.use(express.json());
app.use(bodyParser.json()) // para procesar datos enviados en formato JSON
app.use(bodyParser.urlencoded({ extended: true })) // para procesar datos enviados en formato URL-encoded

//routes
app.use('/api/users', require('./routes/user'));
app.use('/api/verifyToken', require('./routes/verifyToken'));
app.use('/api/products', require('./routes/product'));

//starting the server
app.listen(port, () => {
  console.log('Server on port', port);
  swaggerDocs(app,port);
});




