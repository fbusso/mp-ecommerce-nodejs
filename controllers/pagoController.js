/* 
 Información de la API en:
 https://www.mercadopago.com.ar/developers/es/reference/preferences/_checkout_preferences/post/
*/


const mp = require('mercadopago');
const config = require('../config/local-config');
const payer_data = require('../models/payer_data');

const INTEGRATOR_ID = config.integrator_id;
const PUBLIC_KEY    = config.public_key;
const ACCESS_TOKEN  = config.access_token;
const COLLECTOR_ID  = config.collector_id;

mp.configure({
    access_token: ACCESS_TOKEN,
    integrator_id: INTEGRATOR_ID
});

const pagoController = {}

pagoController.registrarPago = async function(req, res) {
    let payload = req.body;
    var preference = {};

    preference.payer = payer_data;
    preference.external_reference = 'francisco.busso@outlook.com';
    
    preference.items = [
        {
            id: payload.id,                                 // String(256): identificador del ítem
            title: payload.title,                           // String(256): título del item. Se mostrará en el flujo de pago
            description: payload.description,               // String(256): Descripción del ítem
            picture_url: payload.picture_url,               // String(600): URL de imagen del ítem
            category_id: payload.category_id,               // String(256): identificador de categoría del ítem
            quantity: parseInt(payload.quantity),           // Integer    : cantidad de ítems
            currency_id: payload.currency_id,               // String(3)  : identificador de moenda (en formato ISO_4217)
            unit_price: parseFloat(payload.unit_price)      // Float      : precio unitario
        }
    ];

    preference.payment_methods = {
        /*
         No quiere permitir pagos con tarjetas
         American Express (amex) 
        */
        'excluded_payment_methods': [
            {'id' : 'amex'}
        ],
        /*
         ni tampoco con medios de pago del
         tipo cajero automático (atm).
        */
        'excluded_payment_types': [
            {'id' : 'atm'}
        ],
        /* 
         El cliente quiere que los pagos con tarjeta de crédito
         se puedan pagar permitiendo como máximo 6 cuotas
        */
        'installments': 6
    };

    // URLs de retorno al sitio del vendedor:
    preference.back_urls = {
        'success': config.success_endpoint,
        'pending': config.pending_endpoint,
        'failure': config.failure_endpoint
    };

    // URL para recibir notificaciones de pagos:
    preference.notification_url = config.notification_endpoint;
    
    /*
     Cuando se configura como true los pagos sólo pueden resultar aprobados o rechazados. 
     Caso contrario también pueden resultar in_process.
    */
    preference.binary_mode = false;

    /*
     Se deberá configurar para que desde el checkout de Mercado Pago 
     el retorno en caso de pago aprobado sea automático.
    */
    preference.auto_return = "approved";

    let response = await mp.preferences.create(preference);
    res.redirect(response.response.sandbox_init_point);
};

module.exports = pagoController;