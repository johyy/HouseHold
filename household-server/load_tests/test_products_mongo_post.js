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

const TEST_URL = 'http://localhost:3002/testproducts'

export default function () {
  const payload = JSON.stringify({
    name: `Test Product ${Math.floor(Math.random() * 100000)}`,
    description: 'Performance testing product',
    user_id: '12345',
  })

  const params = {
    headers: { 'Content-Type': 'application/json' },
  }

  const res = http.post(TEST_URL, payload, params)

  check(res, {
    'status is 201': (r) => r.status === 201,
  })

  sleep(0.5)
}