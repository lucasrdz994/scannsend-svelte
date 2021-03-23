const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();

const db = admin.firestore();

exports.writeNote = functions.firestore
  .document('users/{userId}/shipments/{shipmentId}')
  .onCreate(async (snap, context) => {
    const itemData = snap.data();

    const orderId = itemData.orderId;
    const sellerId = itemData.seller.id;

    const doc = await db.doc(`users/${context.params.userId}/meliAccounts/${sellerId}`).get();
    const accessToken = doc.data().accessToken;

    await axios.post(`https://api.mercadolibre.com/orders/${orderId}/notes`, {
      "note": "Paquete escaneado en Scannsend."
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
});

exports.sendMessage = functions.firestore
  .document('users/{userId}/shipments/{shipmentId}')
  .onCreate(async (snap, context) => {
    const itemData = snap.data();

    let orderId = itemData.orderId;
    const sellerId = itemData.seller.id;

    const doc = await db.doc(`users/${context.params.userId}/meliAccounts/${sellerId}`).get();
    const accessToken = doc.data().accessToken;

    const orderData = await axios.get(`https://api.mercadolibre.com/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const packId = orderData.data.pack_id;

    if (packId !== null) {
      orderId = packId;
    }

    await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orderId}/option`, {
      "option_id": "DELIVERY_PROMISE",
      "template_id": "TEMPLATE___DELIVERY_PROMISE___1",
      "vars": [{
          "id": "TEMPLATE___DELIVERY_PROMISE___1___VAR___INIT",
          "value": 13
      },
      {
          "id": "TEMPLATE___DELIVERY_PROMISE___1___VAR___LIMIT",
          "value": 21
      }]
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
});