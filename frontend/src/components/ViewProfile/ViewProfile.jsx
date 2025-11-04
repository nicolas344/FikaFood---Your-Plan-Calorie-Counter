import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Calendar, Target, Activity, Droplets, ArrowLeft, Edit, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Alert from '../common/Alert';
import LanguageSwitcher from '../common/LanguageSwitcher';

const ViewProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formatActivityLevel = (level) => {
    return t(`profile.activityLevels.${level}`) || t('profile.notSpecified');
  };

  const formatObjective = (objective) => {
    return t(`profile.objectives.${objective}`) || t('profile.notSpecified');
  };

  const formatGender = (gender) => {
    return t(`profile.genders.${gender}`) || t('profile.notSpecified');
  };

  const formatDietaryPreference = (preference) => {
    return t(`profile.diets.${preference}`) || t('profile.notSpecified');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="mr-4 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('profile.back')}
              </Button>

              <Button
                onClick={() => navigate('/profile-setup')}
                variant="primary"
                size="sm"
                className="flex items"
              >
                <Edit className="w-4 h-4 mr-1" />
                {t('profile.edit')}
              </Button>
            </div>
            
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4">
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                {t('profile.personalInfo')}
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.fullName')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : t('profile.notSpecified')}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.email')}</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-gray-400" />
                  {user?.email || t('profile.notSpecified')}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.dateOfBirth')}</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  {user?.date_of_birth || t('profile.notSpecified')}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.gender')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatGender(user?.gender)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-600" />
                {t('profile.physicalInfo')}
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.weight')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.weight ? `${user.weight} kg` : t('profile.notSpecified')}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.height')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.height ? `${user.height} cm` : t('profile.notSpecified')}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.activityLevel')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatActivityLevel(user?.activity_level)}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.objective')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatObjective(user?.objective)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-orange-600" />
                {t('profile.dietaryPreferences')}
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.dietType')}</label>
                <p className="text-sm text-gray-900 mt-1 font-semibold">
                  {formatDietaryPreference(user?.dietary_preference)}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.additionalRestrictions')}</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.additional_restrictions || t('profile.none')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-600" />
                {t('profile.nutritionalGoals')}
              </h2>
            </div>
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">{t('profile.dailyCalories')}</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.calories_goal ? `${user.calories_goal} kcal` : t('profile.notSpecified')}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">{t('profile.proteins')}</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.protein_goal ? `${user.protein_goal}g` : t('profile.notSpecified')}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">{t('profile.carbohydrates')}</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.carbs_goal ? `${user.carbs_goal}g` : t('profile.notSpecified')}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">{t('profile.fats')}</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.fat_goal ? `${user.fat_goal}g` : t('profile.notSpecified')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Droplets className="w-4 h-4 mr-2 text-blue-600" />
                {t('profile.hydration')}
              </h2>
            </div>
            <div className="px-4 py-3">
              <div>
                <label className="text-xs font-medium text-gray-500">{t('profile.dailyWaterGoal')}</label>
                <p className="text-lg text-gray-900 mt-2 font-bold text-center">
                  {user?.water_goal ? `${user.water_goal} ml` : t('profile.notSpecified')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewProfile;
