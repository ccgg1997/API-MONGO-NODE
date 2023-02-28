const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
//notadata ifo about our api
const options = {
  definition: {
    openaapi: '3.0.0',
    info:{
      title:'crossfit WOD API', version:'1.0.0'}

    },
    apis:['./routes/*.js','src/database.js'],
  };
  
  //docs in json format
  const swaggerSpec = swaggerJsDoc(options);

  //function to set up the swagger docs
  const swaggerDocs = (app,port) => {
    app.use('/api/routes/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    app.get('/api/routes/docs.json',(req,res) => {
      res.setHeader('Content-Type','application/json');
      res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${port}/api/routes/docs`)
  };

  module.exports = {swaggerDocs};