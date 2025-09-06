import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = ''
}) => {
  const types = {
    success: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    },
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-400'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-400'
    },
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-400'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  if (!message) return null;

  return (
    <div className={`
      rounded-md border p-4 mb-4
      ${config.bgColor}
      ${config.borderColor}
      ${className}
    `}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className={`ml-3 flex-1 ${config.textColor}`}>
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${config.textColor} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
