import { Tag } from 'antd';

type TypeActivitiesProps = {
  status: 'call' | 'task' | 'note' | 'calendar' | 'annotation' | 'other';
};
const TypeActivities = ({ status }: TypeActivitiesProps) => {
  const renderTypeActivities = () => {
    switch (status) {
      case 'call':
        return <Tag color="blue">Call</Tag>;
      case 'task':
        return <Tag color="green">Task</Tag>;
      case 'note':
        return <Tag color="purple">Note</Tag>;
      case 'calendar':
        return <Tag color="orange">Calendar</Tag>;
      case 'annotation':
        return <Tag color="cyan">Annotation</Tag>;
      case 'other':
        return <Tag color="red">Other</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  return renderTypeActivities();
};

export default TypeActivities;
