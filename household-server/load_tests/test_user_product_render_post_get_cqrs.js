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
            exec: 'getProducts', 
        },
    },
}

const USER_URL = 'https://household-users.onrender.com/login'
const PRODUCT_URL = 'https://household-products.onrender.com/products'

const postDuration = new Trend('post_req_duration')
const getDuration = new Trend('get_req_duration')

export function setup() {
    const loginPayload = JSON.stringify({
        username: 'user',
        password: 'password'
    })

    const params = { headers: { 'Content-Type': 'application/json' } }
    const loginRes = http.post(USER_URL, loginPayload, params)

    check(loginRes, { 'Login successful (200)': (r) => r.status === 200 })

    const userData = JSON.parse(loginRes.body)
    const token = userData.token

    return { token, userId: userData.user.id } 
}

export function postProducts(data) {
    const productParams = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
        }
    }

    const productPayload = JSON.stringify({
        name: `Test Product ${Math.floor(Math.random() * 100000)}`,
        description: 'Performance testing product',
        user_id: data.userId, 
        location_id: '67938d8212d19c62da977bc6',
        category_id: '6793888312d19c62da977bbe',
        expiration_date: new Date().toISOString(),
        quantity: Math.floor(Math.random() * 10) + 1,
        unit: 'pcs'
    })

    const postRes = http.post(PRODUCT_URL, productPayload, productParams)
    postDuration.add(postRes.timings.duration)

    check(postRes, { 'Product created (201)': (r) => r.status === 201 })
}

export function getProducts(data) {
    const productParams = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
        }
    }

    const getRes = http.get(PRODUCT_URL, productParams)
    getDuration.add(getRes.timings.duration)

    check(getRes, { 'GET success (200)': (r) => r.status === 200 })
}