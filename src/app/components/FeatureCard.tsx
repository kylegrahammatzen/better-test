type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = (props: FeatureCardProps) => {
  return (
    <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
      {props.icon}
      <div>
        <h2 className="text-xl font-semibold mb-2">{props.title}</h2>
        <p className="text-gray-600">{props.description}</p>
      </div>
    </div>
  );
};

export { FeatureCard };
