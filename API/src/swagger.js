const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
//notadata ifo about our api
const options = {
  definition: {
    openapi: "3.0.0",
    info:{
      title:"API BOLSAS ROMY", version:"1.0.0"},

    },
    apis:["src/routes/user.js","src/database.js","src/routes/product.js","src/routes/bodega.js","src/routes/negocio.js","src/routes/movimiento.js","src/routes/factura.js","src/routes/detalleFactura.js","src/routes/familia.js","src/routes/inventario.js", "src/routes/listaprecios.js", "src/routes/persona.js", "src/routes/produccion.js", "src/routes/eventos.js"]
  };
  
  //docs in json format
  const swaggerSpec = swaggerJsDoc(options);

  //function to set up the swagger docs
  const swaggerDocs = (app,port) => {
    app.use('/',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    app.get('/api/docs.json',(req,res) => {
      res.setHeader('Content-Type','application/json');
      res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at port 6000 in docker, but is available at http://localhost:5000`)
  };

  module.exports = {swaggerDocs};