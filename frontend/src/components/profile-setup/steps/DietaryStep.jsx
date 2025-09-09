import { Utensils } from 'lucide-react';
import Select from '../../common/Select';
import Input from '../../common/Input';

const DietaryStep = ({ formData, onChange, validationErrors }) => {
  const dietaryPreferenceOptions = [
    { value: 'classic', label: 'Clásico' },
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'pescetarian', label: 'Pescetariano' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Utensils className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Preferencias alimentarias
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza tu plan según tus gustos y restricciones
        </p>
      </div>

      <Select
        label="Preferencia dietética"
        name="dietary_preference"
        value={formData.dietary_preference}
        onChange={onChange}
        options={dietaryPreferenceOptions}
      />

      <Input
        label="Restricciones adicionales (opcional)"
        type="text"
        name="additional_restrictions"
        value={formData.additional_restrictions}
        onChange={onChange}
        placeholder="Ej: Alérgico a nueces, intolerante a lactosa..."
      />
    </div>
  );
};

export default DietaryStep;