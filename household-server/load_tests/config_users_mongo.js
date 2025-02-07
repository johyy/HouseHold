import http from 'k6/http'
import { check } from 'k6'

export const options = {
    // For light load test
    // vus: 500,  DONE
    // iterations: 1000 DONE

    // For average load test
    // vus: 500, DONE
    // iterations: 10000, DONE

    // For heavy load test
    vus: 5000, 
    iterations: 100000 
}

const TEST_URL = 'http://localhost:3001/testusers/mongo'

export default function () {
    const payload = JSON.stringify({
        name: `Test User ${Math.floor(Math.random() * 100000)}`,
        username: `user${Math.floor(Math.random() * 100000)}`,
        password: 'testpassword',
    })

    const params = {
        headers: { 'Content-Type': 'application/json' },
    }

    const res = http.post(TEST_URL, payload, params)

    check(res, {
      'status is 201': (r) => r.status === 201,
    })
}
