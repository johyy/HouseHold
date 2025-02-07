import http from 'k6/http'
import { check } from 'k6'

export const options = {
    scenarios: {
        default: {
            executor: 'shared-iterations',
            vus: 1,  
            iterations: 1, 
            maxDuration: '60m'
        }
    }
}

const USER_URL = 'https://household-users.onrender.com/users'
const PRODUCT_URL = 'https://household-products.onrender.com/products'

export function setup() {
    const userPayload = JSON.stringify({
        name: `User`,
        username: `user`,
        password: 'password'
    })

    const params = { headers: { 'Content-Type': 'application/json' } }
    const userRes = http.post(USER_URL, userPayload, params)

    check(userRes, { 'User created (201)': (r) => r.status === 201 })

    const userData = JSON.parse(userRes.body)
    const token = userData.token
    const userId = userData.user.id

    return { token, userId } 
}

export default function (data) {
    const productParams = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
        }
    }

    for (let i = 0; i < 10000; i++) {
        const productPayload = JSON.stringify({
            name: `Preload Product ${i}`,
            description: 'Preloaded product',
            user_id: data.userId, 
            location_id: '67938d8212d19c62da977bc6',
            category_id: '6793888312d19c62da977bbe',
            expiration_date: new Date().toISOString(),
            quantity: Math.floor(Math.random() * 10) + 1,
            unit: 'pcs'
        })

        const productRes = http.post(PRODUCT_URL, productPayload, productParams)
        check(productRes, { 'Product created (201)': (r) => r.status === 201 })
    }
}
