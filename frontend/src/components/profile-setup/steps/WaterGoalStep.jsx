import Input from '../../common/Input';

const WaterGoalStep = ({ formData, onChange, validationErrors }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Meta de hidratación
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Define tu objetivo de consumo de agua diario
        </p>
      </div>

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
  );
};

export default WaterGoalStep;
