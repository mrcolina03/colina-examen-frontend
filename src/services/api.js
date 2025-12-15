import axios from 'axios';

// Al usar proxy inverso, no ponemos http://localhost:8080, sino la ruta relativa.
// Nginx se encargará de redirigir esto al backend.
const api = axios.create({
    baseURL: '/api/v1/purchase-orders',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;