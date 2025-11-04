import { useTranslation } from 'react-i18next';
import { Target, Zap } from 'lucide-react';
import Select from '../../common/Select';

const LifestyleStep = ({ formData, onChange, validationErrors }) => {
  const { t } = useTranslation();
  
  const activityLevelOptions = [
    { value: 'sedentary', label: t('profileSetup.lifestyle.sedentary') },
    { value: 'moderate', label: t('profileSetup.lifestyle.moderate') },
    { value: 'active', label: t('profileSetup.lifestyle.active') }
  ];

  const objectiveOptions = [
    { value: 'lose', label: t('profileSetup.lifestyle.lose') },
    { value: 'maintain', label: t('profileSetup.lifestyle.maintain') },
    { value: 'gain', label: t('profileSetup.lifestyle.gain') }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl shadow-lg mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          {t('profileSetup.lifestyle.title')}
        </h3>
        <p className="text-gray-600">
          {t('profileSetup.lifestyle.subtitle')}
        </p>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <Select
            label={t('profileSetup.lifestyle.activityLevel')}
            name="activity_level"
            value={formData.activity_level}
            onChange={onChange}
            options={activityLevelOptions}
            placeholder={t('profileSetup.lifestyle.selectActivityLevel')}
            error={validationErrors.activity_level}
            required
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Zap className="absolute left-4 top-9 w-5 h-5 text-lime-500 group-hover:text-lime-600 transition-colors duration-200" />
        </div>

        <div className="relative group">
          <Select
            label={t('profileSetup.lifestyle.objective')}
            name="objective"
            value={formData.objective}
            onChange={onChange}
            options={objectiveOptions}
            placeholder={t('profileSetup.lifestyle.selectObjective')}
            error={validationErrors.objective}
            required
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Target className="absolute left-4 top-9 w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors duration-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-lime-800">
            <p className="font-medium mb-1">{t('profileSetup.lifestyle.smartPersonalization')}</p>
            <p className="text-lime-700">{t('profileSetup.lifestyle.smartPersonalizationAnswer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
