import { Tag } from 'antd';

interface PriorityTaskProps {
  value: string;
}

const PriorityTask: React.FC<PriorityTaskProps> = ({ value }) => {
  const renderPriority = () => {
    switch (value) {
      case 'low':
        return (
          <Tag bordered={false} color="blue">
            Low
          </Tag>
        );
      case 'medium':
        return (
          <Tag bordered={false} color="orange">
            Medium
          </Tag>
        );
      case 'high':
        return (
          <Tag bordered={false} color="purple">
            High
          </Tag>
        );

      default:
        return 'No Priority';
    }
  };
  return renderPriority();
};

export default PriorityTask;
