import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const WaterGoalStep = ({ formData, onChange, validationErrors }) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWater, setGeneratedWater] = useState(null);
  const [error, setError] = useState(null);

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setError(null);
    
    if (selectedMethod === 'ai') {
      onChange({ target: { name: 'water_goal', value: '' } });
    }
    
    onChange({ target: { name: 'water_method', value: selectedMethod } });
  };

  const generateAIWater = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          message: 'cuánta agua debo beber'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const responseText = data.response;
        const waterMatch = responseText.match(/(\d{3,4})\s*ml/i);

        if (waterMatch) {
          const waterMl = waterMatch[1];
          const waterLiters = (waterMl / 1000).toFixed(1);

          setGeneratedWater({
            ml: waterMl,
            liters: waterLiters
          });
          
          onChange({ target: { name: 'water_goal', value: waterLiters } });
        } else {
          setError(t('profileSetup.waterGoal.errorExtracting'));
        }
      } else {
        setError(t('profileSetup.waterGoal.errorGeneratingAI'));
      }
    } catch (err) {
      setError(t('profileSetup.waterGoal.errorConnection'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t('profileSetup.waterGoal.title')}
        </h3>
        <p className="text-gray-600">
          {t('profileSetup.waterGoal.subtitle')}
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 block">
          {t('profileSetup.waterGoal.method')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleMethodChange('manual')}
            className={`group p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              method === 'manual'
                ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className={`w-8 h-8 ${method === 'manual' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <span>{t('profileSetup.waterGoal.manual')}</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('ai')}
            className={`group p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              method === 'ai'
                ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className={`w-8 h-8 ${method === 'ai' ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span>{t('profileSetup.waterGoal.ai')}</span>
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
          <Input
            label={t('profileSetup.waterGoal.litersPerDay')}
            type="number"
            name="water_goal"
            value={formData.water_goal}
            onChange={onChange}
            error={validationErrors.water_goal}
            placeholder={t('profileSetup.waterGoal.litersPlaceholder')}
            min="1"
            max="8"
            step="0.1"
            required
            className="transition-all duration-200 focus:shadow-lg"
          />
          
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="font-semibold text-cyan-800 mb-2">{t('profileSetup.waterGoal.generalRecommendations')}</p>
                <ul className="space-y-2 text-sm text-cyan-700">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">💧</span>
                    <span>{t('profileSetup.waterGoal.adults')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">🏃</span>
                    <span>{t('profileSetup.waterGoal.exercise')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">🥤</span>
                    <span>{t('profileSetup.waterGoal.allSources')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <button
              type="button"
              onClick={generateAIWater}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('profileSetup.waterGoal.generating')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  {t('profileSetup.waterGoal.generateWithAI')}
                </>
              )}
            </button>
          </div>

          {generatedWater && (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4 className="font-bold text-cyan-800 text-lg">{t('profileSetup.waterGoal.generatedByAI')}</h4>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-cyan-600">{generatedWater.liters}</p>
                    <p className="text-sm text-cyan-700 font-medium mt-1">{t('profileSetup.waterGoal.litersDay')}</p>
                  </div>
                  <div className="text-cyan-400 text-4xl">💧</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{generatedWater.ml}</p>
                    <p className="text-sm text-blue-700 font-medium mt-1">{t('profileSetup.waterGoal.mlDay')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WaterGoalStep;
