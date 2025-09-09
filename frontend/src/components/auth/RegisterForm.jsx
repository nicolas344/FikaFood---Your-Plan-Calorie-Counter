import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

    if (!formData.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.first_name) {
      errors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name) {
      errors.last_name = 'El apellido es requerido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.password_confirm) {
      errors.password_confirm = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData);
    
    if (result.success) {
      // Redirigir al formulario de perfil con el token ya establecido
      navigate('/profile-setup');
    }
  };

  const getErrorMessage = () => {
    if (error?.email) return error.email[0];
    if (error?.username) return error.username[0];
    if (error?.password) return error.password[0];
    if (error?.non_field_errors) return error.non_field_errors[0];
    if (error?.message) return error.message;
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Únete a FikaFood
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea tu cuenta para comenzar
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
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
                label="Nombre de usuario"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={validationErrors.username}
                placeholder="usuario123"
                required
                className="pl-10"
              />
              <User className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={validationErrors.first_name}
                placeholder="Juan"
                required
              />
              <Input
                label="Apellido"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={validationErrors.last_name}
                placeholder="Pérez"
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
                placeholder="Mínimo 8 caracteres"
                required
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                error={validationErrors.password_confirm}
                placeholder="Repite tu contraseña"
                required
                className="pl-10 pr-10"
              />
              <Lock className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Crear Cuenta
            </Button>

            <div className="text-center text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
