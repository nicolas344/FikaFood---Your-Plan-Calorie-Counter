import { useState } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const CalorieGoalStep = ({ formData, onChange, validationErrors }) => {
  const [method, setMethod] = useState('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGoals, setGeneratedGoals] = useState(null);
  const [error, setError] = useState(null);

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setError(null);
    
    // Limpiar valores al cambiar método
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
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          message: 'genera mis metas nutricionales'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Parsear la respuesta para extraer las metas
        const responseText = data.response;
        
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
          
          // Actualizar formData
          onChange({ target: { name: 'calories_goal', value: goals.calories } });
          onChange({ target: { name: 'protein_goal', value: goals.protein } });
          onChange({ target: { name: 'carbs_goal', value: goals.carbs } });
          onChange({ target: { name: 'fat_goal', value: goals.fat } });
        } else {
          setError('No se pudieron extraer las metas de la respuesta de IA');
        }
      } else {
        setError('Error al generar metas con IA');
      }
    } catch (err) {
      setError('Error de conexión al generar metas');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Metas nutricionales diarias
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Elige cómo quieres establecer tus metas nutricionales
        </p>
      </div>

      {/* Selector de método */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Método de configuración
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleMethodChange('manual')}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
              method === 'manual'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('ai')}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
              method === 'ai'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            Generado por IA
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

      {/* Contenido según método seleccionado */}
      {method === 'manual' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Calorías"
              type="number"
              name="calories_goal"
              value={formData.calories_goal}
              onChange={onChange}
              error={validationErrors.calories_goal}
              placeholder="2000"
              min="1200"
              max="5000"
              required
            />
            <Input
              label="Proteína (g)"
              type="number"
              name="protein_goal"
              value={formData.protein_goal}
              onChange={onChange}
              error={validationErrors.protein_goal}
              placeholder="150"
              min="50"
              max="300"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Carbohidratos (g)"
              type="number"
              name="carbs_goal"
              value={formData.carbs_goal}
              onChange={onChange}
              error={validationErrors.carbs_goal}
              placeholder="250"
              min="100"
              max="500"
              required
            />
            <Input
              label="Grasa (g)"
              type="number"
              name="fat_goal"
              value={formData.fat_goal}
              onChange={onChange}
              error={validationErrors.fat_goal}
              placeholder="67"
              min="30"
              max="150"
              required
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <Button
              type="button"
              onClick={generateAIGoals}
              isLoading={isGenerating}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generando metas...' : 'Generar metas con IA'}
            </Button>
          </div>

          {generatedGoals && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Metas generadas por IA:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Calorías:</span> {generatedGoals.calories}
                </div>
                <div>
                  <span className="font-medium">Proteína:</span> {generatedGoals.protein}g
                </div>
                <div>
                  <span className="font-medium">Carbohidratos:</span> {generatedGoals.carbs}g
                </div>
                <div>
                  <span className="font-medium">Grasa:</span> {generatedGoals.fat}g
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