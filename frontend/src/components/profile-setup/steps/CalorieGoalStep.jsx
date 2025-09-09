import Input from '../../common/Input';

const CalorieGoalStep = ({ formData, onChange, validationErrors }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Meta calórica diaria
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Define tu objetivo calórico diario
        </p>
      </div>

      <Input
        label="Calorías objetivo por día"
        type="number"
        name="calorie_goal"
        value={formData.calorie_goal}
        onChange={onChange}
        error={validationErrors.calorie_goal}
        placeholder="2000"
        min="1200"
        max="5000"
        required
      />

      <div className="text-sm text-gray-500">
        <p>Recomendaciones generales:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Mujeres: 1,800-2,400 calorías</li>
          <li>Hombres: 2,200-3,000 calorías</li>
          <li>Varía según actividad física y objetivos</li>
        </ul>
      </div>
    </div>
  );
};

export default CalorieGoalStep;