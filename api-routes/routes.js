const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/', function (req, res) {
    res.render('home');
});

router.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

/*
 Una vez que el pagador termine el flujo de Mercado Pago,
 se deberá retornar al sitio web del cliente y manejar 
 una pantalla diferente para cada estado de pago:
*/

/*
 El pago haya sido exitoso. En la pantalla se deberá mostrar 
 la información proveniente de los parámetros que enviamos en 
 el Query String como:
 - payment_method_id que se usó para pagar
 - valor del campo external_reference
 - id de pago (payment_id o collection_id) de Mercado
 Pago.

 Se deberá configurar para que desde el checkout de Mercado Pago el
 retorno en caso de pago aprobado sea automático (auto_return).
*/ 

router.get('/success', function (req, res) {
    res.render('success', req.query);
});

/*
 El usuario haya decidido pagar con un medio de pago offline 
 (ticket) y el pago quede en un estado “pending” o “in_process”
*/ 
router.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

/*
 El pago haya sido “rechazado” o no haya finalizado (failure):
*/
router.get('/failure', function (req, res) {
    res.render('failure', req.query);
});

/*
Se debe generar un endpoint que sea capaz de 
recibir nuestras notificaciones Webhook
*/
router.post('/payment_notification', function(req) {
    console.log(req.body);
});

router.post('/payment', function(req, res) {
    pagoController.registrarPago(req, res);
});

module.exports = router;