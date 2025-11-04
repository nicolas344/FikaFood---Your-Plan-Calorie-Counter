import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import chatbotService from '../../../services/chatbotService';

const CalorieGoalStep = ({ formData, onChange, validationErrors }) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGoals, setGeneratedGoals] = useState(null);
  const [error, setError] = useState(null);

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setError(null);
    
    if (selectedMethod === 'ai') {
      onChange({ target: { name: 'calories_goal', value: '' } });
      onChange({ target: { name: 'protein_goal', value: '' } });
      onChange({ target: { name: 'carbs_goal', value: '' } });
      onChange({ target: { name: 'fat_goal', value: '' } });
    }
    
    onChange({ target: { name: 'goals_method', value: selectedMethod } });
  };

  const generateAIGoals = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await chatbotService.sendMessage('genera mis metas nutricionales');
      
      if (result.success && result.data) {
        const responseText = result.data.response || '';
        
        const caloriesMatch = responseText.match(/calorías:\s*(\d+)/i);
        const proteinMatch = responseText.match(/proteína:\s*(\d+)g/i);
        const carbsMatch = responseText.match(/carbohidratos:\s*(\d+)g/i);
        const fatMatch = responseText.match(/grasa:\s*(\d+)g/i);

        if (caloriesMatch && proteinMatch && carbsMatch && fatMatch) {
          const goals = {
            calories: caloriesMatch[1],
            protein: proteinMatch[1],
            carbs: carbsMatch[1],
            fat: fatMatch[1]
          };

          setGeneratedGoals(goals);
          
          onChange({ target: { name: 'calories_goal', value: goals.calories } });
          onChange({ target: { name: 'protein_goal', value: goals.protein } });
          onChange({ target: { name: 'carbs_goal', value: goals.carbs } });
          onChange({ target: { name: 'fat_goal', value: goals.fat } });
        } else {
          setError(t('profileSetup.calorieGoals.errorGenerating'));
        }
      } else {
        setError(t('profileSetup.calorieGoals.errorGeneratingAI'));
      }
    } catch (err) {
      setError(t('profileSetup.calorieGoals.errorConnection'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          {t('profileSetup.calorieGoals.title')}
        </h3>
        <p className="text-gray-600">
          {t('profileSetup.calorieGoals.subtitle')}
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 block">
          {t('profileSetup.calorieGoals.method')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleMethodChange('manual')}
            className={`group p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              method === 'manual'
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className={`w-8 h-8 ${method === 'manual' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <span>{t('profileSetup.calorieGoals.manual')}</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('ai')}
            className={`group p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              method === 'ai'
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className={`w-8 h-8 ${method === 'ai' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span>{t('profileSetup.calorieGoals.ai')}</span>
            </div>
          </button>
        </div>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {method === 'manual' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('profileSetup.calorieGoals.calories')}
              type="number"
              name="calories_goal"
              value={formData.calories_goal}
              onChange={onChange}
              error={validationErrors.calories_goal}
              placeholder={t('profileSetup.calorieGoals.caloriesPlaceholder')}
              min="1200"
              max="5000"
              required
              className="transition-all duration-200 focus:shadow-lg"
            />
            <Input
              label={t('profileSetup.calorieGoals.protein')}
              type="number"
              name="protein_goal"
              value={formData.protein_goal}
              onChange={onChange}
              error={validationErrors.protein_goal}
              placeholder={t('profileSetup.calorieGoals.proteinPlaceholder')}
              min="50"
              max="300"
              required
              className="transition-all duration-200 focus:shadow-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('profileSetup.calorieGoals.carbs')}
              type="number"
              name="carbs_goal"
              value={formData.carbs_goal}
              onChange={onChange}
              error={validationErrors.carbs_goal}
              placeholder={t('profileSetup.calorieGoals.carbsPlaceholder')}
              min="100"
              max="500"
              required
              className="transition-all duration-200 focus:shadow-lg"
            />
            <Input
              label={t('profileSetup.calorieGoals.fat')}
              type="number"
              name="fat_goal"
              value={formData.fat_goal}
              onChange={onChange}
              error={validationErrors.fat_goal}
              placeholder={t('profileSetup.calorieGoals.fatPlaceholder')}
              min="30"
              max="150"
              required
              className="transition-all duration-200 focus:shadow-lg"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <button
              type="button"
              onClick={generateAIGoals}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('profileSetup.calorieGoals.generating')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  {t('profileSetup.calorieGoals.generateWithAI')}
                </>
              )}
            </button>
          </div>

          {generatedGoals && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4 className="font-bold text-green-800 text-lg">{t('profileSetup.calorieGoals.generatedByAI')}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                  <p className="text-xs text-green-600 font-medium mb-1">{t('profileSetup.calorieGoals.calories')}</p>
                  <p className="text-2xl font-bold text-green-700">{generatedGoals.calories}</p>
                  <p className="text-xs text-green-600">{t('profileSetup.calorieGoals.kcalPerDay')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">{t('profileSetup.calorieGoals.protein')}</p>
                  <p className="text-2xl font-bold text-blue-700">{generatedGoals.protein}</p>
                  <p className="text-xs text-blue-600">{t('profileSetup.calorieGoals.gramsPerDay')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
                  <p className="text-xs text-yellow-600 font-medium mb-1">{t('profileSetup.calorieGoals.carbs')}</p>
                  <p className="text-2xl font-bold text-yellow-700">{generatedGoals.carbs}</p>
                  <p className="text-xs text-yellow-600">{t('profileSetup.calorieGoals.gramsPerDay')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                  <p className="text-xs text-orange-600 font-medium mb-1">{t('profileSetup.calorieGoals.fat')}</p>
                  <p className="text-2xl font-bold text-orange-700">{generatedGoals.fat}</p>
                  <p className="text-xs text-orange-600">{t('profileSetup.calorieGoals.gramsPerDay')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalorieGoalStep;
