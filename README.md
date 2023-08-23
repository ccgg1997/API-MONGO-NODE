# VISUALIZADOR INVENTARIO (API-MONGO-NODE)

* _Api rest para sistema de facturacion con mongodb (cluster en atlas) y node (18) 
*  Es un proyecto enfocado en resolver el tema de inventario y facturación de la empresa Bolsas R._

## Comenzando 🚀

   * Clonar repositorio desde la terminal (git clone ...) 
   * Abrir la terminal (ventana aparte o desde visual) 
   * Entrar al directorio donde se descargo el repositorio 
   * En el directorio ingresar a la carpeta del proyecto (API-MONGO-NODE), luego entrar a la carpeta API

Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

* _Docker Compose_
* _Credenciales para mondo en la nube o base de datos mongo local_

### Instalación (Deployment) 🔧
 
  * Abrir la terminal (ventana aparte o desde visual) (generalmente con ctrl+ f1) y verificar ruta donde se quiere clonar el repo
    ej:( c:user/descargas)
  * Clonar repositorio desde la terminal (git clone https://github.com/ccgg1997/API-MONGO-NODE.git)
  * Entrar al directorio donde se descargo el repositorio (c:user/descargas)
  * En el directorio ingresar a la carpeta del proyecto (API-MONGO-NODE), luego entrar a la carpeta API (c:user/descargas/      API-MONGO-NODE/API)
  * Deberia ver en su terminal algo asi: DIRECCION_DONDE_DESCARGO_EL_REPO\API-MONGO-NODE\API
  * Cree un archivo .env (con dos variables: mongodburi= "DireccionDeSuBaseDeDatosMongo.com" y retryWrites=true&w=majority)
    ![image](https://github.com/ccgg1997/API-MONGO-NODE/assets/89625031/18e0971f-9b6d-43bd-ad96-c5531fc07ca3)

  * luego ejecute el comando: docker-compose build o docker compose build 
  * por ultimo ejecute docker compose up
  * ingresa a la api mediante la direccion localhost:5000


## Construido con 🛠️

* [Node](http://www.nodejs.org) - El framework web usado
* [Mongo](https://mongodb.com) - Base datos en la nube
* [Swagger](https://swagger.io) - Usado para generar documentacion

## Contribuyendo 🖇️

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/villanuevand/xxxxxx) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests.

## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en nuestra [Wiki](https://github.com/tu/proyecto/wiki)

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores ✒️

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

* **Cristian Gomez** - *Trabajo Inicial* - [cristian gomez](https://github.com/ccgg1997)
* **Jose Bravo** - *Documentación y jwt* - [Jose bravo](#fulanito-de-tal)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 🎁

* Comenta a otros sobre este proyecto 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo. 
* Da las gracias públicamente 🤓.
* Dona con cripto a esta dirección (binance) pay id: `329709027`
* etc.
