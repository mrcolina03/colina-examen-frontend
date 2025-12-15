import axios from 'axios';

// Usamos ruta relativa.
// - En local: Vite redirige /api -> localhost:8080/api
// - En Docker: Nginx redirige /api -> purchase-service:8080/api
const api = axios.create({
    baseURL: '/api/v1/purchase-orders', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;