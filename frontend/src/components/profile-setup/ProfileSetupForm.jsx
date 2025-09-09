import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import Button from '../common/Button';
import BasicInfoStep from './steps/BasicInfoStep';
import PhysicalInfoStep from './steps/PhysicalInfoStep';
import LifestyleStep from './steps/LifestyleStep';
import DietaryStep from './steps/DietaryStep';
import CalorieGoalStep from './steps/CalorieGoalStep';
import WaterGoalStep from './steps/WaterGoalStep';

const ProfileSetupForm = () => {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState({
    date_of_birth: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    objective: '',
    dietary_preference: 'classic',
    additional_restrictions: '',
    calorie_goal: '',
    water_goal: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);
  };

  const validateCurrentStep = () => {
    const errors = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.date_of_birth) {
          errors.date_of_birth = 'Fecha de nacimiento es requerida';
        } else {
          const birthDate = new Date(formData.date_of_birth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          
          if (age < 13 || age > 120) {
            errors.date_of_birth = 'Edad debe estar entre 13 y 120 años';
          }
        }
        if (!formData.gender) {
          errors.gender = 'Género es requerido';
        }
        break;
      
      case 2: // Physical Info
        if (!formData.weight) {
          errors.weight = 'Peso es requerido';
        } else if (isNaN(formData.weight) || formData.weight <= 0) {
          errors.weight = 'Peso inválido';
        }
        if (!formData.height) {
          errors.height = 'Altura es requerida';
        } else if (isNaN(formData.height) || formData.height <= 0) {
          errors.height = 'Altura inválida';
        }
        break;
      
      case 3: // Lifestyle
        if (!formData.activity_level) {
          errors.activity_level = 'Nivel de actividad es requerido';
        }
        if (!formData.objective) {
          errors.objective = 'Objetivo es requerido';
        }
        break;
      
      case 4: // Dietary
        if (!formData.dietary_preference) {
          errors.dietary_preference = 'Preferencia dietética es requerida';
        }
        break;
      
      case 5: // Calorie Goal
        if (!formData.calorie_goal) {
          errors.calorie_goal = 'Meta calórica es requerida';
        }
        break;
        
      case 6: // Water Goal
        if (!formData.water_goal) {
          errors.water_goal = 'Meta de agua es requerida';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para actualizar el perfil después de cada paso
  const updateProfileStep = async (stepData) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(stepData);
      
      if (!result.success) {
        setError(result.error?.message || 'Error al actualizar el perfil');
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar datos según el paso actual
  const getStepData = () => {
    switch (currentStep) {
      case 1:
        return {
          date_of_birth: formData.date_of_birth,
          gender: formData.gender
        };
      case 2:
        return {
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height)
        };
      case 3:
        return {
          activity_level: formData.activity_level,
          objective: formData.objective
        };
      case 4:
        return {
          dietary_preference: formData.dietary_preference,
          additional_restrictions: formData.additional_restrictions
        };
      case 5:
        return {
          calorie_goal: parseInt(formData.calorie_goal)
        };
      case 6:
        return {
          water_goal: parseFloat(formData.water_goal)
        };
      default:
        return {};
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Actualizar perfil con los datos del paso actual
    const stepData = getStepData();
    const updateSuccess = await updateProfileStep(stepData);
    
    if (!updateSuccess) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Último paso completado, ir al dashboard
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      onChange: handleChange,
      validationErrors
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <PhysicalInfoStep {...stepProps} />;
      case 3:
        return <LifestyleStep {...stepProps} />;
      case 4:
        return <DietaryStep {...stepProps} />;
      case 5:
        return <CalorieGoalStep {...stepProps} />;
      case 6:
        return <WaterGoalStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: 'Información básica',
      2: 'Información física',
      3: 'Estilo de vida',
      4: 'Preferencias dietéticas',
      5: 'Meta calórica',
      6: 'Meta de agua',
    };
    return titles[currentStep];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Personaliza tu perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getStepTitle()} - Paso {currentStep} de {totalSteps}
          </p>
          
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {error && (
            <Alert 
              type="error" 
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {renderStep()}

          <div className="flex space-x-4">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevious}
                className="flex-1"
                disabled={isLoading}
              >
                Anterior
              </Button>
            )}
            
            <Button 
              type="button" 
              onClick={handleNext}
              className="flex-1"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {currentStep === totalSteps ? 'Completar' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupForm;
