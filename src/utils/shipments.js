import { db, auth } from '../firebase';
import { refreshToken } from './user';
import { shipments } from '../stores/shipments';

export async function validateQr(qr, packages) {
  try {
    // Check for duplicated
    const duplicated = packages.find(item => item.id === Number(qr.id))
    if (duplicated) {
      throw new Error('El paquete se encuentra duplicado.');
    }

    // Get current Meli account
    const doc = await db.collection('users').doc(auth.currentUser.uid).collection('meliAccounts').doc(String(qr.sender_id)).get();
    const meliAcccount = doc.data();

    // Check access token
    if (meliAcccount.expires <= Date.now()) {
      const token = await refreshToken(meliAcccount)
      meliAcccount.accessToken = token;
    }
    
    // Meli API
    const headers = {
      'Authorization': 'Bearer ' + meliAcccount.accessToken
    }
    const res = await fetch(`https://api.mercadolibre.com/shipments/${qr.id}`,{ headers });
    const data = await res.json();
    
    // Check shipping status
    if (data.status !== 'ready_to_ship') {
      if (data.status === 'delivered') {
        throw new Error('El paquete ya fue entregado al comprador.');
      } else if (data.status === 'canceled') {
        throw new Error('La operación fue cancelada. No envíes este paquete.');
      } else {
        throw new Error('Revisá la operación en Mercado Libre.');
      }
    }

    // Shipment data objet
    const shippingData = {
      createdAt: Date.parse(data.date_created),
      id: data.id,
      orderId: data.order_id,
      status: data.status,
      scannedAt: Date.now(),
      shippingItems: data.shipping_items,
      statusHistory: {
        dateCancelled: Date.parse(data.status_history.date_cancelled) || null,
        dateDelivered: Date.parse(data.status_history.date_delivered) || null,
        dateFirstVisit: Date.parse(data.status_history.date_first_visit) || null,
        dateHandling: Date.parse(data.status_history.date_handling) || null,
        dateNotDelivered: Date.parse(data.status_history.date_not_delivered) || null,
        dateReadyToShip: Date.parse(data.status_history.date_ready_to_ship) || null,
        dateReturned: Date.parse(data.status_history.date_returned) || null,
        dateShipped: Date.parse(data.status_history.date_shipped) || null
      },
      buyer: {
        name: data.receiver_address.receiver_name,
        id: data.receiver_id,
        phone: data.receiver_address.receiver_phone,
        streetName: data.receiver_address.street_name,
        streetNumber: data.receiver_address.street_number,
        state: data.receiver_address.state.name,
        city: data.receiver_address.city.name,
        zipCode: data.receiver_address.zip_code,
        fullAddress: data.receiver_address.street_name + ' ' + data.receiver_address.street_number
      },
      seller: {
        id: data.sender_id,
        nickname: meliAcccount.nickname,
        deliveryCourier: 'Blitzz'
      }
    }

    // Save on Firestore
    const newDoc = await db.collection('users')
    .doc(auth.currentUser.uid)
    .collection('shipments')
    .add(shippingData)

    shippingData.uid = newDoc.id

    return {
      status: 'ok',
      shipping: shippingData
    }

  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

export async function deleteShipment(uid) {
  console.log(uid)
  try {
    await db.collection('users').doc(auth.currentUser.uid).collection('shipments').doc(uid).delete();
    shipments.remove(uid);
    return {
      status: 'ok'
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    }
  }
}

export async function sentPaginationNext(last, filter) {
  const from = Date.parse(filter.dateFrom) + 60 * 60 * 3 * 1000;
  const to = Date.parse(filter.dateTo) + 60 * 60 * 27 * 1000;

  const ref = db.collection('users')
  .doc(auth.currentUser.uid)
  .collection('shipments')
  .where('scannedAt', '>=', from)
  .where('scannedAt', '<=', to)
  .orderBy('scannedAt', 'desc')
  .startAfter(last)
  .limit(50)

  try {
    const docs = await ref.get();
    if (!docs.empty) {
      const lastDoc = docs.docs[docs.docs.length - 1];
      const firstDoc = docs.docs[0];
      let arr = [];
      docs.forEach(doc => {
        const item = { uid: doc.id, ...doc.data() }
        arr.push(item);
      })
      return {
        lastDoc,
        firstDoc,
        arr,
        empty: false
      }
    } else {
      return {
        empty: true
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export async function sentPaginationPrev(first, filter) {
  const from = Date.parse(filter.dateFrom) + 60 * 60 * 3 * 1000;
  const to = Date.parse(filter.dateTo) + 60 * 60 * 27 * 1000;

  const ref = db.collection('users')
  .doc(auth.currentUser.uid)
  .collection('shipments')
  .where('scannedAt', '>=', from)
  .where('scannedAt', '<=', to)
  .orderBy('scannedAt', 'desc')
  .endBefore(first)
  .limitToLast(50)

  try {
    const docs = await ref.get();
    if (!docs.empty) {
      const lastDoc = docs.docs[docs.docs.length - 1];
      const firstDoc = docs.docs[0];
      let arr = [];
      docs.forEach(doc => {
        const item = { uid: doc.id, ...doc.data() }
        arr.push(item);
      })
      return {
        lastDoc,
        firstDoc,
        arr
      }
    } else {
      return {
        empty: true
      }
    }
    console.log(docs)
  } catch (error) {
    console.log(error)
  }
}