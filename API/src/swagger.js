const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
//notadata ifo about our api
const options = {
  definition: {
    openapi: "3.0.0",
    info:{
      title:"API BOLSAS ROMY", version:"1.0.0"},

    },
    apis:["src/routes/user.js","src/database.js"],
  };
  
  //docs in json format
  const swaggerSpec = swaggerJsDoc(options);

  //function to set up the swagger docs
  const swaggerDocs = (app,port) => {
    app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    app.get('/api/docs.json',(req,res) => {
      res.setHeader('Content-Type','application/json');
      res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${port}/api/routes/docs`)
  };

  module.exports = {swaggerDocs};