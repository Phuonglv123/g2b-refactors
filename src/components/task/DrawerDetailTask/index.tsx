import access from '@/access';
import DisplayUser from '@/components/user/DisplayUser';
import {
  updateApprroveTask,
  updateRejectTask,
  updateStateTask,
  updateStatusTask,
} from '@/services/task';
import { ITask } from '@/types/task';
import { formatDate } from '@/utils';
import { CommentOutlined } from '@ant-design/icons';
import { DrawerForm } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Divider, Flex, Modal, Select, Space, Typography, message } from 'antd';
import { useState } from 'react';
import CommentEditor from '../CommentEditor';
import ModalCreateTask from '../ModalCreateTask';
import PriorityTask from '../PriorityTask';
import ShowCommentTask from '../ShowCommentTask';
import StatusTask from '../StatusTask';
import TypeTask from '../TypeTask';
import styles from './style.less';

const DrawerDetailTask = ({ task, onLoad }: { task: ITask; onLoad?: any }) => {
  const { initialState } = useModel('@@initialState');
  const { canApprove } = access(initialState);
  const [isComment, setIsComment] = useState(false);

  const onApproveModal = () => {
    Modal.confirm({
      title: 'Approve',
      content: 'Are you sure you want to approve this task?',
      onOk: async () => {
        try {
          await updateApprroveTask(task._id);
          message.success('Approve task successfully');
          onLoad();
        } catch (error) {
          message.error('Approve task failed');
        }
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const onRejectModal = () => {
    Modal.confirm({
      title: 'Reject',
      content: 'Are you sure you want to reject this task?',
      onOk: async () => {
        try {
          await updateRejectTask(task._id);
          message.success('Reject task successfully');
          onLoad();
        } catch (error) {
          message.error('Reject task failed');
        }
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  if (!task) return null;
  return (
    <DrawerForm
      drawerProps={{
        destroyOnClose: true,
        onClose: (e) => {
          onLoad();
        },
      }}
      width={600}
      trigger={
        <div className={styles.titelDraw}>
          {task.name?.toString().length > 40
            ? task.name?.toString().toUpperCase().substring(0, 40) + '...'
            : task.name?.toString().toUpperCase()}
        </div>
      }
      title={
        <Flex justify="space-between">
          <div>{task?.name?.toString().toUpperCase()}</div>
          <ModalCreateTask onLoad={onLoad} subTask={task?._id} />
        </Flex>
      }
      submitter={{
        render: (props, dom) => {
          if (canApprove && task?.state === 'approve') {
            return (
              <Flex gap={24} style={{ width: '100%' }}>
                <Button key="submit" type="primary" block onClick={() => onApproveModal()}>
                  Approve
                </Button>
                <Button key="submit" type="primary" danger block onClick={() => onRejectModal()}>
                  Reject
                </Button>
              </Flex>
            );
          }
          return null;
        },
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <div>Code: </div>
          <Typography.Text strong>{task?.code}</Typography.Text>
        </Flex>
        <Flex justify="space-between">
          <div>Type: </div>
          <TypeTask value={task?.type} />
        </Flex>
        <Flex justify="space-between">
          <div>Priority: </div>
          <PriorityTask value={task?.priority} />
        </Flex>
        <Flex justify="space-between">
          <div>Status: </div>
          <Select
            value={task?.status}
            style={{ width: 150 }}
            size="middle"
            onChange={async (value) => {
              try {
                await updateStatusTask(task?._id, value);
                onLoad();
              } catch (error) {}
            }}
            options={[
              {
                label: <StatusTask value={'called'} />,
                value: 'called',
              },
              {
                label: <StatusTask value={'quote_sent'} />,
                value: 'quote_sent',
              },
              {
                label: <StatusTask value={'negotiate'} />,
                value: 'negotiate',
              },
              {
                label: <StatusTask value={'win'} />,
                value: 'win',
              },
              {
                label: <StatusTask value={'not_contacted'} />,
                value: 'not_contacted',
              },
              {
                label: <StatusTask value={'messaged'} />,
                value: 'messaged',
              },
              {
                label: <StatusTask value={'consider'} />,
                value: 'consider',
              },
              {
                label: <StatusTask value={'no_response'} />,
                value: 'no_response',
              },
              {
                label: <StatusTask value={'working'} />,
                value: 'working',
              },
              {
                label: <StatusTask value={'pending'} />,
                value: 'pending',
              },
              {
                label: <StatusTask value={'failed'} />,
                value: 'failed',
              },
              {
                label: <StatusTask value={'approve'} />,
                value: 'approve',
                disabled: true,
              },
              {
                label: <StatusTask value={'rejected'} />,
                value: 'rejected',
                disabled: true,
              },
            ]}
          />
        </Flex>
        {initialState?.currentUser?.role === 'admin' && (
          <Flex justify="space-between">
            <div>State: </div>
            <Select
              value={task?.state}
              style={{ width: 150 }}
              size="middle"
              onChange={async (value) => {
                try {
                  await updateStateTask(task?._id, value).then(() => {
                    message.success('Update state successfully');
                    onLoad();
                  });
                } catch (error) {}
              }}
              options={[
                {
                  label: 'To do',
                  value: 'todo',
                },
                {
                  label: 'In progress',
                  value: 'inprogress',
                },
                {
                  label: 'Approved',
                  value: 'approved',
                },
                {
                  label: 'Follow',
                  value: 'follow',
                },
                {
                  label: 'Completed',
                  value: 'completed',
                },
              ]}
            />
          </Flex>
        )}
      </Space>

      <Divider orientation="left">Time</Divider>
      <Flex justify="space-between">
        <div>Deadline: </div>
        <div>{formatDate(task?.deadline)}</div>
      </Flex>
      <Flex justify="space-between">
        <div>Estimated time: </div>
        <div>{formatDate(task?.estimated_time)}</div>
      </Flex>
      <Divider orientation="left">People</Divider>
      <Flex justify="space-between">
        <div>Assigned by: </div>
        {task?.assigned_by && <DisplayUser user={task?.assigned_by} />}
      </Flex>
      <Flex justify="space-between">
        <div>Assigned to: </div>
        {task?.assigned_to.map((user: any) => (
          <DisplayUser key={user._id} user={user} />
        ))}
      </Flex>
      {task?.approved_by && (
        <Flex justify="space-between">
          <div>Approved by: </div>
          <DisplayUser user={task?.approved_by} />
        </Flex>
      )}
      <Divider orientation="left">Description</Divider>
      <div dangerouslySetInnerHTML={{ __html: task.description }}></div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Typography.Title level={3}>Comments</Typography.Title>
          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => setIsComment(!isComment)}
          >
            Add Comment
          </Button>
        </Flex>
        {isComment && task?._id && <CommentEditor taskId={task?._id} onLoad={() => onLoad()} />}
        <div
          style={{
            maxHeight: 600,
            overflow: 'auto',
          }}
        >
          <ShowCommentTask comments={task?.comments} refresh={() => onLoad()} />
        </div>
      </Space>
    </DrawerForm>
  );
};

export default DrawerDetailTask;
