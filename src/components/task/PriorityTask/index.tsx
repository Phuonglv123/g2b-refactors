import { Tag } from 'antd';

interface PriorityTaskProps {
  value: string;
}

const PriorityTask: React.FC<PriorityTaskProps> = ({ value }) => {
  const renderPriority = () => {
    switch (value) {
      case 'low':
        return <Tag color="blue">Low</Tag>;
      case 'medium':
        return <Tag color="orange">Medium</Tag>;
      case 'high':
        return <Tag color="red">High</Tag>;

      default:
        return 'No Priority';
    }
  };
  return renderPriority();
};

export default PriorityTask;
