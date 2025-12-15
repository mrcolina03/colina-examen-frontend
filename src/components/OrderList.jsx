import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OrderList = ({ refreshTrigger }) => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({ 
        q: '', 
        status: '',
        currency: '',
        minTotal: '',
        maxTotal: '',
        from: '',
        to: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    const fetchOrders = async () => {
        setErrorMsg(''); // Limpiar errores previos

        // --- VALIDACIONES DE FRONTEND ---
        if (filters.minTotal && Number(filters.minTotal) < 0) {
            setErrorMsg("El monto mínimo no puede ser negativo.");
            return;
        }
        if (filters.maxTotal && Number(filters.maxTotal) < 0) {
            setErrorMsg("El monto máximo no puede ser negativo.");
            return;
        }
        if (filters.from && filters.to && new Date(filters.from) > new Date(filters.to)) {
            setErrorMsg("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
            return;
        }

        try {
            // Construimos los params dinámicamente
            const params = {};
            if (filters.q) params.q = filters.q;
            if (filters.status) params.status = filters.status;
            if (filters.currency) params.currency = filters.currency;
            if (filters.minTotal) params.minTotal = filters.minTotal;
            if (filters.maxTotal) params.maxTotal = filters.maxTotal;

            // Formateo de fechas para LocalDateTime (Backend espera ISO-8601)
            // Agregamos hora de inicio y fin de día para cubrir el rango completo
            if (filters.from) params.from = `${filters.from}T00:00:00`;
            if (filters.to) params.to = `${filters.to}T23:59:59`;

            const response = await api.get('', { params });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Si el backend devuelve error (ej: 400), lo mostramos
            if (error.response && error.response.data && error.response.data.message) {
                 setErrorMsg(`Error del servidor: ${error.response.data.message}`);
            } else {
                 setErrorMsg("Ocurrió un error al obtener las órdenes.");
            }
        }
    };

    // Recargar cuando cambie el trigger o los filtros
    useEffect(() => {
        // Debounce simple para evitar llamadas excesivas mientras se escribe
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500); 
        return () => clearTimeout(timer);
    }, [refreshTrigger, filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Listado de Órdenes</h4>
            </div>

            {/* Mensaje de Error de Validación */}
            {errorMsg && (
                <div className="alert alert-danger" role="alert">
                    {errorMsg}
                </div>
            )}

            {/* Panel de Filtros */}
            <div className="row g-2 mb-3 bg-light p-3 rounded">
                {/* 1. Búsqueda Texto */}
                <div className="col-md-4">
                    <label className="form-label small fw-bold">Buscar</label>
                    <input type="text" className="form-control form-control-sm" placeholder="# Orden o Proveedor" 
                           name="q" value={filters.q} onChange={handleFilterChange}/>
                </div>

                {/* 2. Estado */}
                <div className="col-md-2">
                    <label className="form-label small fw-bold">Estado</label>
                    <select className="form-select form-select-sm" name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>

                {/* 3. Moneda (Nuevo) */}
                <div className="col-md-2">
                    <label className="form-label small fw-bold">Moneda</label>
                    <select className="form-select form-select-sm" name="currency" value={filters.currency} onChange={handleFilterChange}>
                        <option value="">Todas</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                {/* 4. Rango de Montos (Nuevo) */}
                <div className="col-md-2">
                    <label className="form-label small fw-bold">Monto Mín</label>
                    <input type="number" className="form-control form-control-sm" placeholder="0.00" 
                           name="minTotal" value={filters.minTotal} onChange={handleFilterChange}/>
                </div>
                <div className="col-md-2">
                    <label className="form-label small fw-bold">Monto Máx</label>
                    <input type="number" className="form-control form-control-sm" placeholder="Max" 
                           name="maxTotal" value={filters.maxTotal} onChange={handleFilterChange}/>
                </div>

                {/* 5. Rango de Fechas (Nuevo) */}
                <div className="col-md-3">
                    <label className="form-label small fw-bold">Desde</label>
                    <input type="date" className="form-control form-control-sm" 
                           name="from" value={filters.from} onChange={handleFilterChange}/>
                </div>
                <div className="col-md-3">
                    <label className="form-label small fw-bold">Hasta</label>
                    <input type="date" className="form-control form-control-sm" 
                           name="to" value={filters.to} onChange={handleFilterChange}/>
                </div>
                
                {/* Botón para limpiar filtros */}
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-sm btn-secondary w-100" onClick={() => setFilters({
                        q: '', status: '', currency: '', minTotal: '', maxTotal: '', from: '', to: ''
                    })}>
                        Limpiar
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th># Orden</th>
                            <th>Proveedor</th>
                            <th>Estado</th>
                            <th>Monto</th>
                            <th>Moneda</th>
                            <th>Fecha Creación</th>
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
                                        <span className={`badge bg-${
                                            order.status === 'APPROVED' ? 'success' : 
                                            order.status === 'REJECTED' || order.status === 'CANCELLED' ? 'danger' : 
                                            order.status === 'SUBMITTED' ? 'info' : 'secondary'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="fw-bold">{order.totalAmount}</td>
                                    <td>{order.currency}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No se encontraron órdenes con esos filtros
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;