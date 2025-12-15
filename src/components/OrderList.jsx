import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OrderList = ({ refreshTrigger }) => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({ q: '', status: '' });

    const fetchOrders = async () => {
        try {
            // Construimos los params dinámicamente: si están vacíos no los enviamos
            const params = {};
            if (filters.q) params.q = filters.q;
            if (filters.status) params.status = filters.status;

            const response = await api.get('', { params });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Recargar cuando cambie el trigger (nueva orden creada) o los filtros
    useEffect(() => {
        fetchOrders();
    }, [refreshTrigger, filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Listado de Órdenes</h4>
            </div>

            {/* Barra de Filtros Simple */}
            <div className="row g-2 mb-3">
                <div className="col-md-8">
                    <input type="text" className="form-control" placeholder="Buscar por # o proveedor..." 
                           name="q" value={filters.q} onChange={handleFilterChange}/>
                </div>
                <div className="col-md-4">
                    <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">Todos los Estados</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th># Orden</th>
                            <th>Proveedor</th>
                            <th>Estado</th>
                            <th>Monto</th>
                            <th>Moneda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.orderNumber}</td>
                                    <td>{order.supplierName}</td>
                                    <td>
                                        <span className={`badge bg-${order.status === 'APPROVED' ? 'success' : order.status === 'REJECTED' ? 'danger' : 'secondary'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{order.totalAmount}</td>
                                    <td>{order.currency}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No se encontraron órdenes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;