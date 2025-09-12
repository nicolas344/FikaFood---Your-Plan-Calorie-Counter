import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminRegistersList = () => {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllRegisters();
      setRegisters(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading registers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegister = async (registerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await adminService.deleteRegister(registerId);
        loadRegisters();
      } catch (error) {
        console.error('Error deleting register:', error);
        alert('Error al eliminar el registro');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando registros...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Registros de Alimentos</h2>
        <button
          onClick={loadRegisters}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {registers.map((register) => (
            <li key={register.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {register.food_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Usuario: {register.user_email || 'N/A'} | Fecha: {new Date(register.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {register.calories} kcal
                      </p>
                      <p className="text-sm text-gray-500">
                        {register.quantity}g
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>Proteínas: {register.proteins}g</span>
                      <span>Carbohidratos: {register.carbohydrates}g</span>
                      <span>Grasas: {register.fats}g</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteRegister(register.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {registers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay registros de alimentos</p>
        </div>
      )}
    </div>
  );
};

export default AdminRegistersList;
