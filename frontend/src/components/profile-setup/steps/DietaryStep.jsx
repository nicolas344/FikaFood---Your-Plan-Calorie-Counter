import { useTranslation } from 'react-i18next';
import { Utensils, AlertTriangle } from 'lucide-react';
import Select from '../../common/Select';
import Input from '../../common/Input';

const DietaryStep = ({ formData, onChange, validationErrors }) => {
  const { t } = useTranslation();
  
  const dietaryPreferenceOptions = [
    { value: 'classic', label: t('profileSetup.dietary.classic') },
    { value: 'vegetarian', label: t('profileSetup.dietary.vegetarian') },
    { value: 'vegan', label: t('profileSetup.dietary.vegan') },
    { value: 'pescetarian', label: t('profileSetup.dietary.pescetarian') }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl shadow-lg mb-4">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          {t('profileSetup.dietary.title')}
        </h3>
        <p className="text-gray-600">
          {t('profileSetup.dietary.subtitle')}
        </p>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <Select
            label={t('profileSetup.dietary.dietaryPreference')}
            name="dietary_preference"
            value={formData.dietary_preference}
            onChange={onChange}
            options={dietaryPreferenceOptions}
            error={validationErrors.dietary_preference}
            required
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Utensils className="absolute left-4 top-9 w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors duration-200" />
        </div>

        <div className="relative group">
          <Input
            label={t('profileSetup.dietary.additionalRestrictions')}
            type="text"
            name="additional_restrictions"
            value={formData.additional_restrictions}
            onChange={onChange}
            placeholder={t('profileSetup.dietary.additionalRestrictionsPlaceholder')}
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <AlertTriangle className="absolute left-4 top-9 w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">{t('profileSetup.dietary.customizedPlans')}</p>
            <p className="text-green-700">{t('profileSetup.dietary.customizedPlansAnswer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryStep;
