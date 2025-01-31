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

const TEST_URL = 'http://localhost:3001/testusers/postgres'

export default function () {
  const res = http.get(TEST_URL)

  check(res, {
    'status is 200': (r) => r.status === 200,
  })

  sleep(0.5)
}
