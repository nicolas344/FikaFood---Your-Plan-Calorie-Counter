import { useState } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const WaterGoalStep = ({ formData, onChange, validationErrors }) => {
  const [method, setMethod] = useState('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWater, setGeneratedWater] = useState(null);
  const [error, setError] = useState(null);

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setError(null);
    
    // Limpiar valores al cambiar método
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
        // Parsear la respuesta para extraer la meta de agua
        const responseText = data.response;
        
        const waterMatch = responseText.match(/(\d{3,4})\s*ml/i);

        if (waterMatch) {
          const waterMl = waterMatch[1];
          const waterLiters = (waterMl / 1000).toFixed(1);

          setGeneratedWater({
            ml: waterMl,
            liters: waterLiters
          });
          
          // Actualizar formData (convertir a litros)
          onChange({ target: { name: 'water_goal', value: waterLiters } });
        } else {
          setError('No se pudo extraer la meta de agua de la respuesta de IA');
        }
      } else {
        setError('Error al generar meta de agua con IA');
      }
    } catch (err) {
      setError('Error de conexión al generar meta de agua');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Meta de hidratación diaria
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Elige cómo quieres establecer tu meta de consumo de agua
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
          <Input
            label="Litros de agua por día"
            type="number"
            name="water_goal"
            value={formData.water_goal}
            onChange={onChange}
            error={validationErrors.water_goal}
            placeholder="2.5"
            min="1"
            max="8"
            step="0.1"
            required
          />
          
          <div className="text-sm text-gray-500">
            <p>Recomendaciones generales:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Adultos: 2-3 litros por día</li>
              <li>Más cantidad si haces ejercicio</li>
              <li>Incluye agua de todas las fuentes</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <Button
              type="button"
              onClick={generateAIWater}
              isLoading={isGenerating}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generando meta...' : 'Generar meta con IA'}
            </Button>
          </div>

          {generatedWater && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">Meta generada por IA:</h4>
              <div className="text-sm text-blue-700">
                <p><span className="font-medium">Cantidad recomendada:</span> {generatedWater.liters} litros ({generatedWater.ml}ml) por día</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WaterGoalStep;
