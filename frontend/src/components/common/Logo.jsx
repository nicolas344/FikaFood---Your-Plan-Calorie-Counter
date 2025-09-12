import logoFikaFood from '../../assets/logoFikaFood.png';

const Logo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  };

  return (
    <img 
      src={logoFikaFood} 
      alt="FikaFood" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

export default Logo;