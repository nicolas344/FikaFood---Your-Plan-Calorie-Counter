import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateRegisterForm from '../components/registers/CreateRegisterForm';
import DailySummary from '../components/registers/DailySummary';
import RegistersList from '../components/registers/RegistersList';
import Alert from '../components/common/Alert';

const RegistersPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRegisterSuccess = (data) => {
    setSuccessMessage(data.message || 'Registro creado exitosamente');
    setRefreshTrigger(prev => prev + 1);
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Registros de Comida</h1>
                <p className="text-sm text-gray-600">Registra y analiza tus comidas con IA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6">
            <Alert 
              type="success" 
              message={successMessage} 
              onClose={() => setSuccessMessage(null)} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de creación */}
          <div className="lg:col-span-1">
            <CreateRegisterForm onSuccess={handleRegisterSuccess} />
          </div>

          {/* Resumen y lista */}
          <div className="lg:col-span-2 space-y-6">
            <DailySummary refreshTrigger={refreshTrigger} />
            <RegistersList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistersPage;