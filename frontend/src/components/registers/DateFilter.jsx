import { useState } from 'react';
import { Calendar, Clock, ChevronDown, Check, X } from 'lucide-react';

const DateFilter = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filterOptions = [
    { id: 'today', label: 'Hoy', icon: Clock, color: 'blue' },
    { id: 'yesterday', label: 'Ayer', icon: Clock, color: 'gray' },
    { id: 'this_week', label: 'Esta semana', icon: Calendar, color: 'green' },
    { id: 'last_week', label: 'Semana pasada', icon: Calendar, color: 'yellow' },
    { id: 'this_month', label: 'Este mes', icon: Calendar, color: 'purple' },
    { id: 'last_month', label: 'Mes pasado', icon: Calendar, color: 'pink' },
  ];

  const handleFilterSelect = (filterId) => {
    onFilterChange({ period: filterId });
    setIsOpen(false);
    setShowCustomDate(false);
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      onFilterChange({
        period: 'custom',
        start_date: customStartDate,
        end_date: customEndDate
      });
      setIsOpen(false);
      setShowCustomDate(false);
    }
  };

  const handleCustomDateCancel = () => {
    setShowCustomDate(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const getCurrentFilterLabel = () => {
    if (currentFilter.period === 'custom') {
      return `${currentFilter.start_date} - ${currentFilter.end_date}`;
    }
    const option = filterOptions.find(opt => opt.id === currentFilter.period);
    return option ? option.label : 'Hoy';
  };

  const getColorClasses = (color, isSelected = false) => {
    const colors = {
      blue: isSelected 
        ? 'bg-blue-100 text-blue-800 border-blue-300' 
        : 'text-blue-600 hover:bg-blue-50',
      gray: isSelected 
        ? 'bg-gray-100 text-gray-800 border-gray-300' 
        : 'text-gray-600 hover:bg-gray-50',
      green: isSelected 
        ? 'bg-green-100 text-green-800 border-green-300' 
        : 'text-green-600 hover:bg-green-50',
      yellow: isSelected 
        ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
        : 'text-yellow-600 hover:bg-yellow-50',
      purple: isSelected 
        ? 'bg-purple-100 text-purple-800 border-purple-300' 
        : 'text-purple-600 hover:bg-purple-50',
      pink: isSelected 
        ? 'bg-pink-100 text-pink-800 border-pink-300' 
        : 'text-pink-600 hover:bg-pink-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
        <span className="mr-2">{getCurrentFilterLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Filtrar por período</h3>
            
            {/* Quick Filters */}
            <div className="space-y-2 mb-4">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = currentFilter.period === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleFilterSelect(option.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected 
                        ? getColorClasses(option.color, true)
                        : `border-transparent ${getColorClasses(option.color)} hover:border-gray-200`
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Date Range */}
            <div className="border-t pt-4">
              {!showCustomDate ? (
                <button
                  onClick={() => setShowCustomDate(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Período personalizado</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Período personalizado</h4>
                    <button
                      onClick={handleCustomDateCancel}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Desde
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hasta
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomDateSubmit}
                      disabled={!customStartDate || !customEndDate}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={handleCustomDateCancel}
                      className="px-3 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setShowCustomDate(false);
          }}
        />
      )}
    </div>
  );
};

export default DateFilter;
