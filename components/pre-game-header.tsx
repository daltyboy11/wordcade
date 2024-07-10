import Button from './button';

const PreGameHeader = ({
  title,
  description,
  isLoading,
  onClick,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  onClick: () => void;
}) => (
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-xl mb-8 max-w-xl mx-auto text-left">{description}</p>
    <Button
      onClick={onClick}
      isLoading={isLoading}
      loadingText="Claude is creating a game"
    >
      Start
    </Button>
  </div>
);

export default PreGameHeader;
