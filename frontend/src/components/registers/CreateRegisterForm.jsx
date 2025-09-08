import { useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import registerService from '../../services/registerService';

const CreateRegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    image: null,
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.image) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('image', formData.image);
      submitData.append('description', formData.description);

      const result = await registerService.createRegister(submitData);

      if (result.success) {
        // Resetear formulario
        setFormData({ image: null, description: '' });
        setImagePreview(null);
        
        // Llamar callback de éxito
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.error?.message || 'Error al crear registro');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Camera className="w-5 h-5 mr-2" />
        Registrar Comida
      </h2>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen de la comida *
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-48 object-cover rounded-lg mx-auto"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setImagePreview(null);
                  }}
                  className="w-full"
                >
                  Cambiar imagen
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Seleccionar imagen
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, JPEG hasta 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Descripción opcional */}
        <Input
          label="Descripción (opcional)"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe tu comida..."
          rows={3}
        />

        {/* Botón submit */}
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!formData.image}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analizando imagen...
            </>
          ) : (
            'Analizar Comida'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateRegisterForm;