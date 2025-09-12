import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import logoFikaFood from '../../assets/logoFikaFood.png';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el tipo de usuario
      if (result.shouldRedirectToAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const getErrorMessage = () => {
    if (error?.email) return error.email[0];
    if (error?.password) return error.password[0];
    if (error?.non_field_errors) return error.non_field_errors[0];
    if (error?.message) return error.message;
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-4">
            <img 
              src={logoFikaFood} 
              alt="FikaFood Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en FikaFood
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tu plan de calorías personalizado
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {getErrorMessage() && (
            <Alert 
              type="error" 
              message={getErrorMessage()}
              onClose={clearError}
            />
          )}

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
                placeholder="tu@email.com"
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
                placeholder="Tu contraseña"
                required
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
