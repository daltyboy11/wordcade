import { ClipLoader } from 'react-spinners';

interface ButtonProps {
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
  loadingText?: string; // Add the loadingText prop
}

const Button: React.FC<ButtonProps> = ({
  isLoading,
  onClick,
  children,
  loadingText,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{ minWidth: '200px' }}
      className="mt-8 px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
    >
      {isLoading ? (
        <div className="flex items-center">
          <ClipLoader color="#fff" size={16} />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
