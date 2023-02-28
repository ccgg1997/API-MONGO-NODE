const express=require('express');
const app=express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const {createRoles} = require('./libs/initialSetUp');
createRoles();
const {swaggerDocs} = require('./routes/swagger');
//importando el database
require('./database');

//settings
const port=5000;
app.set('json spaces', 2);  //to format the json    
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));   //to understand the data that the user sends
app.use(express.json());
app.use(bodyParser.json()) // para procesar datos enviados en formato JSON
app.use(bodyParser.urlencoded({ extended: true })) // para procesar datos enviados en formato URL-encoded

//routes
app.use(require('./routes/index.routes'));
app.use('/api/users', require('./routes/user'));

//starting the server
app.listen(port, () => {
  console.log('Server on port', port);
  swaggerDocs(app,port);
});




