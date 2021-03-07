import { db, auth } from '../firebase';
import qs from 'qs';

export async function refreshToken(account) {
  console.log('refresh token')
  // Meli request
  const body = qs.stringify({
    grant_type: 'refresh_token',
    client_id: '7167039500463579',
    client_secret: 'Qcd2SBxLxkcdONFj5jmyvpNt2UgJVRoI',
    refresh_token: account.refreshToken
  })
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded'
  }
  try {
    const res = await fetch('https://api.mercadolibre.com/oauth/token',
    {
      method: 'POST',
      body,
      headers
    })
  
    const data = await res.json();
  
    // Update Firestore
    const updatedData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      expires: Date.now() + (data.expires_in * 1000)
    }
  
    await db.collection('users')
    .doc(auth.currentUser.uid)
    .collection('meliAccounts')
    .doc(String(account.sellerId))
    .update(updatedData)

    return data.access_token;
  } catch (error) {
    console.log(error)
  }
}

export async function getMeliAccounts(uid) {
  const accounts = [];
  const docs = await db.collection('users').doc(uid).collection('meliAccounts').get();
  docs.forEach(doc => {
    accounts.push({
      id: doc.id,
      data: doc.data()
    })
  })
  return accounts;
}

export async function linkNewMeliAccount(querystring) {
  const code = qs.parse(querystring);
  if (code) {
    console.log('hay code!', code)
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: '7167039500463579',
      client_secret: 'Qcd2SBxLxkcdONFj5jmyvpNt2UgJVRoI',
      ...code,
      redirect_uri: 'https://scannsend-707df.web.app/panel/settings'
    })
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    }
    try {
      const res = await fetch('https://api.mercadolibre.com/oauth/token', 
      {
        method: 'POST',
        body,
        headers
      })

      const user = await fetch('https://api.mercadolibre.com/users/me',
      {
        headers: {
          'Authorization': 'Bearer ' + res.access_token
        }
      })

      const userData = {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        tokenType: res.token_type,
        sellerId: Number(res.user_id),
        nickname: user.nickname,
        expiresIn: res.expires_in,
        expires: Date.now() + (res.expires_in * 1000)
      }

      await db.collection('users')
      .doc(auth.currentUser.uid)
      .collection('meliAccounts')
      .doc(String(res.user_id))
      .set(userData)

      return userData;

    } catch (error) {
      console.log(error)
    }

  }
}