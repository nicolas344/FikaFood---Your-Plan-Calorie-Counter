import { Weight, Ruler, Activity } from 'lucide-react';
import Input from '../../common/Input';

const PhysicalInfoStep = ({ formData, onChange, validationErrors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          Información Física
        </h3>
        <p className="text-gray-600">
          Necesitamos estos datos para calcular tus necesidades calóricas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative group">
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
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Weight className="absolute left-4 top-9 w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-200" />
        </div>

        <div className="relative group">
          <Input
            label="Altura (cm)"
            type="number"
            name="height"
            value={formData.height}
            onChange={onChange}
            error={validationErrors.height}
            placeholder="170"
            min="1"
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Ruler className="absolute left-4 top-9 w-5 h-5 text-teal-500 group-hover:text-teal-600 transition-colors duration-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-emerald-800">
            <p className="font-medium mb-1">Datos importantes</p>
            <p className="text-emerald-700">Estos valores nos ayudan a calcular tu Índice de Masa Corporal (IMC) y tu metabolismo basal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalInfoStep;