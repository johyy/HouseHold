import http from 'k6/http'
import { check } from 'k6'
import { Trend } from 'k6/metrics'

export const options = {
    scenarios: {
        post_products: {
            executor: 'shared-iterations',
            // vus: 10,   // Light load test DONE
            // iterations: 1000, // Light load test DONE

            // vus: 100,   // Average load test DONE
            // iterations: 10000, // Average load test DONE
            // maxDuration: '30m', // Average load test DONE
            // gracefulStop: '60s', // Average load test DONE

            vus: 1000,   // Heavy load test
            iterations: 100000, // Heavy load test
            maxDuration: '120m', // Heavy load test
            gracefulStop: '60s', // Heavy load test
            exec: 'postProducts',
        },
        get_products: {
            executor: 'shared-iterations',
            // vus: 10,   // Light load test DONE
            // iterations: 1000, // Light load test DONE

            // vus: 100,   // Average load test DONE
            // iterations: 10000, // Average load test DONE
            // maxDuration: '30m', // Average load test DONE
            // gracefulStop: '60s', // Average load test DONE
 
            vus: 1000,   // Heavy load test
            iterations: 100000, // Heavy load test
            maxDuration: '120m', // Heavy load test
            gracefulStop: '60s', // Heavy load test
            exec: 'getProducts',
        },
    },
}

const TEST_URL = 'http://localhost:3001/testusers/mongo'

const postDuration = new Trend('post_req_duration')
const getDuration = new Trend('get_req_duration')

export function postProducts() {
    const payload = JSON.stringify({
        name: `Test User ${Math.floor(Math.random() * 100000)}`,
        username: `user${Math.floor(Math.random() * 100000)}`,
        password: 'testpassword',
    })

    const params = {
        headers: { 'Content-Type': 'application/json' },
    }

    const res = http.post(TEST_URL, payload, params)
    postDuration.add(res.timings.duration);

    check(res, {
        'POST status is 201': (r) => r.status === 201,
    })
}

export function getProducts() {
    const res = http.get(TEST_URL)
    getDuration.add(res.timings.duration)

    check(res, { 'GET status is 200': (r) => r.status === 200 })
}
