import { updateStateTask } from '@/services/task';
import { ITask } from '@/types/task';
import { getSrcImg } from '@/utils';
import { CommentOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Avatar, Col, Dropdown, Flex, Row, Space, Tooltip } from 'antd';
import DrawerDetailTask from '../DrawerDetailTask';
import PriorityTask from '../PriorityTask';
import StatusTask from '../StatusTask';
import TypeTask from '../TypeTask';

const CompletedCard = ({ task, onLoad }: { task: ITask; onLoad?: any }) => {
  const { initialState } = useModel('@@initialState');

  return (
    <ProCard
      key={task._id}
      bordered
      size="small"
      style={{
        backgroundColor: '##1668dc3b',
      }}
    >
      <Row justify={'space-between'} align={'top'}>
        <Col span={21}>
          <Flex align="flex-start" justify="start">
            <TypeTask value={task.type} />
            <DrawerDetailTask task={task} onLoad={() => onLoad()} />
          </Flex>
        </Col>
        <Col span={3}>
          <Tooltip title={task.assigned_to?.username}>
            <Avatar src={getSrcImg(task?.assigned_to?.avatar)} icon={<UserOutlined />} />
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
                      history.push(`/tasks/${task._id}`);
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

export default CompletedCard;
