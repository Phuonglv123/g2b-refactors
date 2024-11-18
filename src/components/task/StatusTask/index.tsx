import { Tag } from 'antd';

interface StatusTaskProps {
  value: string;
}

const StatusTask: React.FC<StatusTaskProps> = ({ value }) => {
  const renderStatus = () => {
    switch (value) {
      case 'called':
        return <Tag color="blue">Called</Tag>;
      case 'quote_sent':
        return <Tag color="orange">Quote Sent</Tag>;
      case 'negotiate':
        return <Tag color="purple">Negotiate</Tag>;
      case 'win':
        return <Tag color="green">Win</Tag>;
      case 'not_contacted':
        return <Tag color="red">Not Contacted</Tag>;
      case 'messaged':
        return <Tag color="cyan">Messaged</Tag>;
      case 'consider':
        return <Tag color="geekblue">Consider</Tag>;
      case 'no_response':
        return <Tag color="magenta">No Response</Tag>;
      default:
        return 'No Status';
    }
  };
  return renderStatus();
};

export default StatusTask;
