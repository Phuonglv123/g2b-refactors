import { createActivity } from '@/services/activities';
import {
  CalendarOutlined,
  CarryOutOutlined,
  FileAddFilled,
  FormOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Tooltip } from 'antd';

type ModalCreateActivitiesProps = {
  type: 'phone' | 'calendar' | 'address' | 'note' | 'task';
  id?: string;
  refresh: () => void;
};

const ModalCreateActivities = ({ type, id, refresh }: ModalCreateActivitiesProps) => {
  const renderButton = (type: string) => {
    switch (type) {
      case 'phone':
        return (
          <Tooltip title="Create Phone Call">
            <Button icon={<PhoneOutlined />} />
          </Tooltip>
        );
      case 'calendar':
        return (
          <Tooltip title="Create Calendar">
            <Button icon={<CalendarOutlined />} />
          </Tooltip>
        );
      case 'address':
        return (
          <Tooltip title="Create Address">
            <Button icon={<FileAddFilled />} />
          </Tooltip>
        );
      case 'note':
        return (
          <Tooltip title="Create Note">
            <Button icon={<FormOutlined />} />
          </Tooltip>
        );

      case 'task':
        return (
          <Tooltip title="Create Task">
            <Button icon={<CarryOutOutlined />} />
          </Tooltip>
        );

      default:
        return <Button icon={<PhoneOutlined />} />;
    }
  };

  const renderTitle = (type: string) => {
    switch (type) {
      case 'phone':
        return 'Create Phone Call - ';
      case 'calendar':
        return 'Create Calendar - ';
      case 'address':
        return 'Create Address - ';
      case 'note':
        return 'Create Note - ';
      case 'task':
        return 'Create Task - ';
      default:
        return 'Create Activity - ';
    }
  };

  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const payload: any = {
        ...values,
        opportunityId: id,
      };

      if (type === 'phone') {
        payload.type = 'call';
      } else if (type === 'calendar') {
        payload.type = 'calendar';
      } else if (type === 'address') {
        payload.type = 'address';
      } else if (type === 'note') {
        payload.type = 'note';
      } else if (type === 'task') {
        payload.type = 'task';
      }

      const { errorCode } = await createActivity(payload);
      if (errorCode === 0) {
        console.log('Create activity success');
        message.success('Create activity success');
        refresh();
        return true;
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to create activity');
    }
  };
  return (
    <ModalForm
      title="Create Activities"
      trigger={renderButton(type)}
      onFinish={onFinish}
      initialValues={{
        title: renderTitle(type),
      }}
    >
      <ProFormText name="title" label="Title" placeholder="Enter the title" />
      <ProFormTextArea name="description" label="Description" placeholder="Enter the description" />
      <ProFormDateTimePicker width="xl" name="dueDate" label="Due Date" />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          {
            label: 'pending',
            value: 'pending',
          },
          {
            label: 'completed',
            value: 'completed',
          },
          {
            label: 'in progress',
            value: 'in-progress',
          },
          {
            label: 'cancelled',
            value: 'cancelled',
          },
        ]}
      />
      <ProFormSelect
        name="priority"
        label="Priority"
        options={[
          {
            label: 'low',
            value: 'low',
          },
          {
            label: 'medium',
            value: 'medium',
          },
          {
            label: 'high',
            value: 'high',
          },
          {
            label: 'urgent',
            value: 'urgent',
          },
        ]}
      />
      <ProFormSelect name="assignTo" label="Assign To" />
      {type === 'phone' && (
        <>
          <ProFormDigit name="callDuration" label="Call Duration" />
          <ProFormTextArea name="callOutcome" label="Call Outcome" />
        </>
      )}
    </ModalForm>
  );
};

export default ModalCreateActivities;
