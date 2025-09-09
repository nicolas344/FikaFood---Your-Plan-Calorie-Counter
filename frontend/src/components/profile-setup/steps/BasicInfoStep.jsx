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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información básica
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Esta información nos ayuda a personalizar tu experiencia
        </p>
      </div>

      <Input
        label="Fecha de nacimiento"
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={onChange}
        error={validationErrors.date_of_birth}
        required
      />

      <Select
        label="Género"
        name="gender"
        value={formData.gender}
        onChange={onChange}
        options={genderOptions}
        error={validationErrors.gender}
        required
      />
    </div>
  );
};

export default BasicInfoStep;