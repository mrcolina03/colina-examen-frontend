import axios from 'axios';

// IMPORTANTE: Debe ser ruta relativa.
// Nginx interceptará "/api" y lo mandará al backend.
const api = axios.create({
    baseURL: '/api/v1/purchase-orders', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;