import { Weight, Ruler, Activity } from 'lucide-react';
import Input from '../../common/Input';

const PhysicalInfoStep = ({ formData, onChange, validationErrors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Activity className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Información física
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Necesitamos estos datos para calcular tus necesidades calóricas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Peso (kg)"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            error={validationErrors.weight}
            placeholder="70"
            min="1"
            step="0.1"
            className="pl-10"
          />
          <Weight className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
        </div>

        <div className="relative">
          <Input
            label="Altura (cm)"
            type="number"
            name="height"
            value={formData.height}
            onChange={onChange}
            error={validationErrors.height}
            placeholder="170"
            min="1"
            className="pl-10"
          />
          <Ruler className="absolute left-3 top-8 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default PhysicalInfoStep;