import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';

function App() {
  const [refreshCount, setRefreshCount] = useState(0);

  // Función para forzar la recarga de la lista cuando se crea una orden
  const handleOrderCreated = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <OrderForm onOrderCreated={handleOrderCreated} />
          </div>
          <div className="col-md-8">
            <OrderList refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;