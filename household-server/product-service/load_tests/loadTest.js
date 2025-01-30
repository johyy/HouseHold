import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 10,
};

const BASE_URL = __ENV.API_URL_PRODUCTS || 'http://localhost';
const PORT = __ENV.PORT || '3002';

const TEST_URL = BASE_URL.includes('localhost') ? `${BASE_URL}:${PORT}/testproducts` : `${BASE_URL}/testproducts`;

export default function () {
  const payload = JSON.stringify({
    name: `Test Product ${Math.floor(Math.random() * 100000)}`,
    description: 'Performance testing product',
    user_id: `${Math.floor(Math.random() * 100000)}`,
    location_id: `${Math.floor(Math.random() * 100000)}`,
    category_id: `${Math.floor(Math.random() * 100000)}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    unit: 'pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(TEST_URL, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(0.5);
}
