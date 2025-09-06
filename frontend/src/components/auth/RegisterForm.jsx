import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Calendar, Weight, Ruler } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Datos básicos
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    // Datos del perfil
    date_of_birth: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: 'sedentary'
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  // Opciones para los selects
  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentario (poco o ningún ejercicio)' },
    { value: 'light', label: 'Actividad ligera (ejercicio ligero 1-3 días/semana)' },
    { value: 'moderate', label: 'Actividad moderada (ejercicio moderado 3-5 días/semana)' },
    { value: 'active', label: 'Muy activo (ejercicio intenso 6-7 días/semana)' },
    { value: 'extra', label: 'Extra activo (ejercicio muy intenso, trabajo físico)' }
  ];

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

  const validateStep1 = () => {
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

  const validateStep2 = () => {
    const errors = {};

    if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0)) {
      errors.weight = 'Peso inválido';
    }

    if (formData.height && (isNaN(formData.height) || formData.height <= 0)) {
      errors.height = 'Altura inválida';
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 120) {
        errors.date_of_birth = 'Edad debe estar entre 13 y 120 años';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    // Limpiar campos vacíos para enviar solo lo necesario
    const submitData = { ...formData };
    if (!submitData.weight) delete submitData.weight;
    if (!submitData.height) delete submitData.height;
    if (!submitData.date_of_birth) delete submitData.date_of_birth;
    if (!submitData.gender) delete submitData.gender;

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/dashboard');
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
            Crea tu cuenta y comienza tu plan personalizado
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Datos básicos</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Perfil</span>
          </div>
        </div>
        
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit}>
          {getErrorMessage() && (
            <Alert 
              type="error" 
              message={getErrorMessage()}
              onClose={clearError}
            />
          )}

          {step === 1 && (
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

              <Button type="submit" className="w-full">
                Continuar
              </Button>

              <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Información adicional</h3>
                <p className="text-sm text-gray-600">
                  Ayúdanos a personalizar tu experiencia (opcional)
                </p>
              </div>

              <div className="relative">
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  error={validationErrors.date_of_birth}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Peso (kg)"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    error={validationErrors.weight}
                    placeholder="70"
                    min="1"
                    step="0.1"
                    className="pl-10"
                  />
                  <Weight className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
                </div>

                <div className="relative">
                  <Input
                    label="Altura (cm)"
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    error={validationErrors.height}
                    placeholder="170"
                    min="1"
                    className="pl-10"
                  />
                  <Ruler className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <Select
                label="Género"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
                placeholder="Selecciona tu género"
              />

              <Select
                label="Nivel de actividad"
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                options={activityLevelOptions}
                required
              />

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevStep}
                  className="flex-1"
                >
                  Anterior
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Crear Cuenta
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
