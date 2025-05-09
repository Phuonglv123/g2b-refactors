import { Tag } from 'antd';
import { useState } from 'react';

interface StatusTaskProps {
  value: string;
}

const StatusTask: React.FC<StatusTaskProps> = ({ value }) => {
  const [isUpdate, setIsUpdate] = useState(false);
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
      case 'approve':
        return <Tag color="green">Approve</Tag>;
      case 'rejected':
        return <Tag color="red">Rejected</Tag>;
      case 'pending':
        return <Tag color="orange">Pending</Tag>;
      case 'failed':
        return <Tag color="red">Failed</Tag>;
      case 'working':
        return <Tag color="green">Working</Tag>;
      default:
        return 'No Status';
    }
  };
  return renderStatus();
};

export default StatusTask;
