import { Target, Zap } from 'lucide-react';
import Select from '../../common/Select';

const LifestyleStep = ({ formData, onChange, validationErrors }) => {
  const activityLevelOptions = [
    { value: 'sedentary', label: '0-2 días por semana' },
    { value: 'moderate', label: '3-5 días por semana' },
    { value: 'active', label: '6+ días por semana' }
  ];

  const objectiveOptions = [
    { value: 'lose', label: 'Perder peso' },
    { value: 'maintain', label: 'Mantener peso' },
    { value: 'gain', label: 'Aumentar peso' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Tu estilo de vida
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Esto nos ayuda a ajustar tu plan de alimentación
        </p>
      </div>

      <Select
        label="¿Cuántas veces haces ejercicio a la semana?"
        name="activity_level"
        value={formData.activity_level}
        onChange={onChange}
        options={activityLevelOptions}
        placeholder="Selecciona tu nivel de actividad"
      />

      <Select
        label="¿Cuál es tu objetivo?"
        name="objective"
        value={formData.objective}
        onChange={onChange}
        options={objectiveOptions}
        placeholder="Selecciona tu objetivo"
      />
    </div>
  );
};

export default LifestyleStep;