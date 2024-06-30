import { ClipLoader } from 'react-spinners';

interface ButtonProps {
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ isLoading, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{ minWidth: '200px' }}
      className="mt-8 px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
    >
      {isLoading ? <ClipLoader color="#fff" size={16} /> : children}
    </button>
  );
};

export default Button;
