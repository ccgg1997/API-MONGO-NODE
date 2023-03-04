const jwt = require('jsonwebtoken');
const config = require('../config');
const { Router } = require('express');
const router = Router();
// ruta que verifica un token
router.get('/', (req, res) => {
  // obtén el token del encabezado de autorización
  try {
    const token = req.headers.authorization
    // verifica la firma y obtén el payload del token
    const payload = jwt.verify(token, config.SECRET);

    // verifica si el token ha expirado
    const now = Date.now().valueOf() / 1000;
    if (payload.exp < now) {
      return res.status(401).json({ message: 'invalid token', status: false });
    }

    // si el token es válido y no ha expirado, devuelve una respuesta exitosa
    return res.status(200).json({ message: 'valid token', status: true });
  } catch (err) {
    // si hay algún error al verificar el token, devuelve una respuesta de error
    return res.status(401).json({ message: 'El token no es válido', status: false });
  }
});

module.exports = router;
