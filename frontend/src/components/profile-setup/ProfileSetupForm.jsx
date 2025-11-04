import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    // Metas nutricionales
    calories_goal: '',
    protein_goal: '',
    carbs_goal: '',
    fat_goal: '',
    goals_method: 'manual',
    // Meta de agua
    water_goal: '',
    water_method: 'manual'
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
      case 1:
        if (!formData.date_of_birth) {
          errors.date_of_birth = t('profileSetup.basicInfo.dateOfBirthRequired');
        } else {
          const birthDate = new Date(formData.date_of_birth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          
          if (age < 13 || age > 120) {
            errors.date_of_birth = t('profileSetup.basicInfo.ageRange');
          }
        }
        if (!formData.gender) {
          errors.gender = t('profileSetup.basicInfo.genderRequired');
        }
        break;
      
      case 2:
        if (!formData.weight) {
          errors.weight = t('profileSetup.physicalInfo.weightRequired');
        } else if (isNaN(formData.weight) || formData.weight <= 0) {
          errors.weight = t('profileSetup.physicalInfo.weightInvalid');
        }
        if (!formData.height) {
          errors.height = t('profileSetup.physicalInfo.heightRequired');
        } else if (isNaN(formData.height) || formData.height <= 0) {
          errors.height = t('profileSetup.physicalInfo.heightInvalid');
        }
        break;
      
      case 3:
        if (!formData.activity_level) {
          errors.activity_level = t('profileSetup.lifestyle.activityLevelRequired');
        }
        if (!formData.objective) {
          errors.objective = t('profileSetup.lifestyle.objectiveRequired');
        }
        break;
      
      case 4:
        if (!formData.dietary_preference) {
          errors.dietary_preference = t('profileSetup.dietary.dietaryPreferenceRequired');
        }
        break;
      
      case 5:
        if (formData.goals_method === 'manual') {
          if (!formData.calories_goal) {
            errors.calories_goal = t('profileSetup.calorieGoals.caloriesRequired');
          }
          if (!formData.protein_goal) {
            errors.protein_goal = t('profileSetup.calorieGoals.proteinRequired');
          }
          if (!formData.carbs_goal) {
            errors.carbs_goal = t('profileSetup.calorieGoals.carbsRequired');
          }
          if (!formData.fat_goal) {
            errors.fat_goal = t('profileSetup.calorieGoals.fatRequired');
          }
        } else if (formData.goals_method === 'ai') {
          if (!formData.calories_goal || !formData.protein_goal || !formData.carbs_goal || !formData.fat_goal) {
            errors.calories_goal = t('profileSetup.calorieGoals.generateFirst');
          }
        }
        break;
        
      case 6:
        if (formData.water_method === 'manual') {
          if (!formData.water_goal) {
            errors.water_goal = t('profileSetup.waterGoal.waterGoalRequired');
          }
        } else if (formData.water_method === 'ai') {
          if (!formData.water_goal) {
            errors.water_goal = t('profileSetup.waterGoal.generateFirst');
          }
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
          calories_goal: parseInt(formData.calories_goal),
          protein_goal: parseInt(formData.protein_goal),
          carbs_goal: parseInt(formData.carbs_goal),
          fat_goal: parseInt(formData.fat_goal),
          goals_method: formData.goals_method
        };
      case 6:
        return {
          water_goal: Math.round(parseFloat(formData.water_goal) * 1000), // Convertir a ml para el backend
          water_method: formData.water_method
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
      1: t('profileSetup.steps.basicInfo'),
      2: t('profileSetup.steps.physicalInfo'),
      3: t('profileSetup.steps.lifestyle'),
      4: t('profileSetup.steps.dietary'),
      5: t('profileSetup.steps.calorieGoals'),
      6: t('profileSetup.steps.waterGoal'),
    };
    return titles[currentStep];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl w-full space-y-8 relative">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {t('profileSetup.title')}
            </h2>
            <p className="text-gray-600 text-base font-medium">
              {getStepTitle()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('profileSetup.step', { current: currentStep, total: totalSteps })}
            </p>
          </div>
          
          {/* Progress bar with steps */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3 relative">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                      step < currentStep
                        ? 'bg-green-500 text-white shadow-lg scale-110'
                        : step === currentStep
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl scale-125 ring-4 ring-green-200'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {index < totalSteps - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                      <div className={`h-full transition-all duration-300 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            {error && (
              <Alert 
                type="error" 
                message={error}
                onClose={() => setError(null)}
              />
            )}

            {renderStep()}

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button" 
                  onClick={handlePrevious}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  {t('profileSetup.previous')}
                </button>
              )}
              
              <button
                type="button" 
                onClick={handleNext}
                className={`${currentStep === 1 ? 'w-full' : 'flex-1'} inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('profileSetup.saving')}
                  </>
                ) : (
                  <>
                    {currentStep === totalSteps ? (
                      <>
                        {t('profileSetup.completeProfile')}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        {t('profileSetup.next')}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            {t('profileSetup.securityMessage')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileSetupForm;
