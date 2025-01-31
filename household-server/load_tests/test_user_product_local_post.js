import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 1,
  iterations: 1
  // Light load test
  // vus: 10,  
  // iterations: 1000,

  // Average load test
  // vus: 100,
  // iterations: 100000,

  // Heavy load test
  // vus: 1000,
  // iterations: 10000000 
}

const USER_URL = 'http://localhost:3001/users'
const PRODUCT_URL = 'http://localhost:3002/products'


export default function () {

  const userPayload = JSON.stringify({
    name: `Test User ${Math.floor(Math.random() * 100000)}`,
    username: `user${Math.floor(Math.random() * 100000)}`,
    password: 'testpassword'
  })

  const params = { headers: { 'Content-Type': 'application/json' } }

  const userRes = http.post(USER_URL, userPayload, params)
  check(userRes, { 'User created (201)': (r) => r.status === 201 })

  const userData = JSON.parse(userRes.body)
  const token = userData.token

  const productPayload = JSON.stringify({
    name: `Test Product ${Math.floor(Math.random() * 100000)}`,
    description: 'Performance testing product',
    user_id: userData.user.id,
    location_id: '67938d8212d19c62da977bc6', 
    category_id: '6793888312d19c62da977bbe',
    expiration_date: new Date().toISOString(),
    quantity: Math.floor(Math.random() * 10) + 1,
    unit: 'pcs'
  })

  const productParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const productRes = http.post(PRODUCT_URL, productPayload, productParams)
  check(productRes, { 'Product created (201)': (r) => r.status === 201 })

  sleep(0.5)
}