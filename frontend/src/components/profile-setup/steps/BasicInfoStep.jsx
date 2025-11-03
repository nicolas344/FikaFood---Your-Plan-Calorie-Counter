import { Calendar, User2 } from 'lucide-react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const BasicInfoStep = ({ formData, onChange, validationErrors }) => {
  const genderOptions = [
    { value: '', label: 'Selecciona tu género' },
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg mb-4">
          <User2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
          Información Básica
        </h3>
        <p className="text-gray-600">
          Esta información nos ayuda a personalizar tu experiencia
        </p>
      </div>

      <div className="space-y-5">
        <div className="relative">
          <Input
            label="Fecha de nacimiento"
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={onChange}
            error={validationErrors.date_of_birth}
            required
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <Calendar className="absolute left-4 top-9 w-5 h-5 text-green-500" />
        </div>

        <div className="relative">
          <Select
            label="Género"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            options={genderOptions}
            error={validationErrors.gender}
            required
            className="pl-12 transition-all duration-200 focus:shadow-lg"
          />
          <User2 className="absolute left-4 top-9 w-5 h-5 text-green-500" />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">¿Por qué necesitamos esto?</p>
            <p className="text-green-700">Tu edad y género nos ayudan a calcular tus necesidades calóricas y nutricionales de manera más precisa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;