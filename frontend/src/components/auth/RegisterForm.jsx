import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import LanguageSwitcher from '../common/LanguageSwitcher';
import logoFikaFood from '../../assets/logoFikaFood.png';

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useTranslation();
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
      errors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('auth.emailInvalid');
    }

    if (!formData.username) {
      errors.username = t('auth.usernameRequired');
    } else if (formData.username.length < 3) {
      errors.username = t('auth.usernameMinLength');
    }

    if (!formData.first_name) {
      errors.first_name = t('auth.firstNameRequired');
    }

    if (!formData.last_name) {
      errors.last_name = t('auth.lastNameRequired');
    }

    if (!formData.password) {
      errors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('auth.passwordMinLength');
    }

    if (!formData.password_confirm) {
      errors.password_confirm = t('auth.confirmPasswordRequired');
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = t('auth.passwordsDoNotMatch');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData);
    
    if (result.success) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="flex justify-between items-start">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">{t('auth.backToLogin')}</span>
          </Link>
          
          <LanguageSwitcher />
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img 
                src={logoFikaFood} 
                alt="FikaFood Logo" 
                className="h-20 w-auto relative z-10 drop-shadow-lg"
              />
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {t('auth.registerTitle')}
            </h2>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              {t('auth.startHealthyJourney')}
              <Sparkles className="w-4 h-4 text-green-500" />
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            {getErrorMessage() && (
              <Alert 
                type="error" 
                message={getErrorMessage()}
                onClose={clearError}
              />
            )}

            <div className="space-y-5">
              <div className="relative group">
                <Input
                  label={t('auth.email')}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="pl-12 pr-4 transition-all duration-200 focus:shadow-lg"
                />
                <Mail className="absolute left-4 top-9 w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
              </div>

              <div className="relative group">
                <Input
                  label={t('auth.username')}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={validationErrors.username}
                  placeholder={t('auth.usernamePlaceholder')}
                  required
                  className="pl-12 pr-4 transition-all duration-200 focus:shadow-lg"
                />
                <User className="absolute left-4 top-9 w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('auth.firstName')}
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={validationErrors.first_name}
                  placeholder={t('auth.firstNamePlaceholder')}
                  required
                  className="transition-all duration-200 focus:shadow-lg"
                />
                <Input
                  label={t('auth.lastName')}
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={validationErrors.last_name}
                  placeholder={t('auth.lastNamePlaceholder')}
                  required
                  className="transition-all duration-200 focus:shadow-lg"
                />
              </div>

              <div className="relative group">
                <Input
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  placeholder={t('auth.passwordMin')}
                  required
                  className="pl-12 pr-12 transition-all duration-200 focus:shadow-lg"
                />
                <Lock className="absolute left-4 top-9 w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative group">
                <Input
                  label={t('auth.confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  error={validationErrors.password_confirm}
                  placeholder={t('auth.repeatPassword')}
                  required
                  className="pl-12 pr-12 transition-all duration-200 focus:shadow-lg"
                />
                <Lock className="absolute left-4 top-9 w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {!isLoading && <UserPlus className="w-5 h-5" />}
                {t('auth.createAccountButton')}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500">{t('auth.alreadyHaveAccount')}</span>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {t('auth.loginButton')}
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t('auth.termsRegistration')}
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
