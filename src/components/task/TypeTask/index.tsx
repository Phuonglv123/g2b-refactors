import { Tag } from 'antd';

type TypeTask = 'brief' | 'task' | 'project' | 'target';
const TypeTask = ({ value }: any) => {
  const renderTypeTask = () => {
    switch (value) {
      case 'brief':
        return <Tag color="blue">Brief</Tag>;
      case 'task':
        return <Tag color="green">Task</Tag>;
      case 'project':
        return <Tag color="purple">Project</Tag>;
      case 'target':
        return <Tag color="orange">Target</Tag>;
      default:
        return '';
    }
  };
  return renderTypeTask();
};

export default TypeTask;
