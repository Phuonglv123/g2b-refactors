import access from '@/access';
import {
  updateApprroveTask,
  updateRejectTask,
  updateStateTask,
  updateStatusTask,
} from '@/services/task';
import { ITask } from '@/types/task';
import { getSrcImg } from '@/utils';
import { CommentOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Avatar, Button, Col, Dropdown, Flex, Modal, Row, Space, Tooltip, message } from 'antd';
import DrawerDetailTask from '../DrawerDetailTask';
import PriorityTask from '../PriorityTask';
import StatusTask from '../StatusTask';
import TypeTask from '../TypeTask';

const ApproveCard = ({ task, onLoad }: { task: ITask; onLoad?: any }) => {
  const { initialState } = useModel('@@initialState');
  const { canApprove } = access(initialState);

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

  const onUpdatedStatus = async (status: string) => {
    try {
      if (task._id) {
        await updateStatusTask(task._id, status).then(async () => {
          if (status === 'approve') {
            await updateStateTask(task._id, 'follow');
          } else if (status === 'rejected') {
            await updateStateTask(task._id, 'in_progress');
          }
        });

        onLoad();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProCard key={task._id} bordered size="small">
      <Row justify={'space-between'} align={'top'}>
        <Col span={21}>
          <Flex align="flex-start" justify="start">
            <TypeTask value={task.type} />
            <DrawerDetailTask task={task} onLoad={() => onLoad()} />
          </Flex>
        </Col>
        <Col span={3}>
          <Tooltip title={task.assigned_to[0]?.username}>
            <Avatar src={getSrcImg(task?.assigned_to[0]?.avatar)} icon={<UserOutlined />} />
          </Tooltip>
        </Col>
      </Row>
      <br />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <div>Priority: </div>
          <PriorityTask value={task.priority} />
        </Flex>
        <Flex justify="space-between">
          <div>Status: </div>
          <StatusTask value={task.status} />
        </Flex>
      </Space>

      <div>
        <br />
        <Flex justify="space-between">
          <div style={{ display: 'flex', gap: 4 }}>
            {task.comments?.length} <CommentOutlined />
          </div>
          {task.state === 'approve' && canApprove && (
            <Space>
              <Button size="small" type="primary" onClick={() => onApproveModal()}>
                Approve
              </Button>
              <Button size="small" type="primary" danger onClick={() => onRejectModal()}>
                Reject
              </Button>
            </Space>
          )}

          <div>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <Tooltip
                        title={
                          (task.status === 'no_response' && 'Change status to receive task') ||
                          (initialState?.currentUser?._id !== task.assigned_to?._id &&
                            'You are not assigned to this task')
                        }
                      >
                        Receive
                      </Tooltip>
                    ),
                    key: 'receive',
                    onClick: async () => {
                      try {
                        if (task._id) {
                          await updateStateTask(task?._id, 'in_progress');
                          onLoad();
                        }
                      } catch (error) {}
                    },
                    disabled:
                      task.assigned_to?._id === initialState?.currentUser?._id &&
                      task.status !== 'no_response'
                        ? false
                        : true,
                  },
                  {
                    label: 'Detail',
                    key: 'detail',
                    onClick: () => {
                      history.push(`/tasks/detail/${task._id}`);
                    },
                  },
                  {
                    label: 'Delete',
                    key: 'delete',
                    onClick: async () => {
                      //   await updateStateTask(task._id, 'delete');
                    },
                  },
                ],
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  more
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Flex>
      </div>
    </ProCard>
  );
};

export default ApproveCard;
