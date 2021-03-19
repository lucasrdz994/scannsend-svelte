const functions = require("firebase-functions");
// const axios = require('axios');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.hello = functions.https.onCall((data, context) => {
  const firstName = data.firstName;
  const lastName = data.lastName;
      
  return {
    firstName : firstName,
    lastName : lastName,
    fullName : firstName + " " + lastName
  }
});


// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();

// app.use(express.json())

// // Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

// app.post('/', async (req, res) => {
//   const { token, order_id } = req.body;
//   console.log(order_id)
//   try {
//     const data = await axios.post(`https://api.mercadolibre.com/orders/${order_id}/notes`, {
//       "note": "Paquete escaneado en Scannsend."
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//     console.log(data)
//     res.json({message: 'Todo ok'})
//   } catch (error) {
//     console.log(error)
//     res.json({message: 'Algo salio mal'})
//   }
// });

// // Expose Express API as a single Cloud Function:
// exports.addNote = functions.https.onRequest(app);
