import React, { useState } from 'react';
import api from '../services/api';

const OrderForm = ({ onOrderCreated }) => {
    const initialState = {
        orderNumber: '',
        supplierName: '',
        status: 'DRAFT',
        totalAmount: '',
        currency: 'USD',
        expectedDeliveryDate: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('', formData);
            setMessage({ type: 'success', text: 'Orden creada exitosamente!' });
            setFormData(initialState); // Limpiar formulario
            if (onOrderCreated) onOrderCreated(); // Recargar lista
        } catch (error) {
            console.error(error);
            setMessage({ type: 'danger', text: 'Error al crear la orden. Verifica que el número de orden sea único' });
        }
    };

    return (
        <div className="card p-4 mb-4">
            <h4>Nueva Orden de Compra</h4>
            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Número de Orden</label>
                        <input type="text" className="form-control" name="orderNumber" 
                               value={formData.orderNumber} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Proveedor</label>
                        <input type="text" className="form-control" name="supplierName" 
                               value={formData.supplierName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                            <option value="DRAFT">DRAFT</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Monto Total</label>
                        <input type="number" step="0.01" className="form-control" name="totalAmount" 
                               value={formData.totalAmount} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Moneda</label>
                        <select className="form-select" name="currency" value={formData.currency} onChange={handleChange}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label">Fecha Esperada</label>
                        <input type="date" className="form-control" name="expectedDeliveryDate" 
                               value={formData.expectedDeliveryDate} onChange={handleChange} />
                    </div>
                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success">Guardar Orden</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;