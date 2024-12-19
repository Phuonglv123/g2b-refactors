import { deleteTask, updateStateTask } from '@/services/task';
import { ITask } from '@/types/task';
import { getSrcImg } from '@/utils';
import { CommentOutlined, DownOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Avatar, Button, Col, Dropdown, Flex, Row, Space, Tooltip, message } from 'antd';
import DrawerDetailTask from '../DrawerDetailTask';
import ModalCreateTask from '../ModalCreateTask';
import PriorityTask from '../PriorityTask';
import StatusTask from '../StatusTask';
import TypeTask from '../TypeTask';

const ToDoCard = ({ task, onLoad }: { task: ITask; onLoad?: any }) => {
  const { initialState } = useModel('@@initialState');

  const onDeleteTask = async (id?: string) => {
    if (!id) return;
    try {
      await deleteTask(id);
      message.success('Delete task successfully');
      onLoad();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProCard
      key={task._id}
      bordered
      size="small"
      // bodyStyle={{
      //   backgroundColor: '#dba41f1f',
      // }}
    >
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
          <Space>
            <div style={{ display: 'flex', gap: 4 }}>
              {task.comments?.length} <CommentOutlined />
            </div>
            <div>
              <Tooltip title="Share">
                <Button
                  size="small"
                  type="text"
                  icon={<ShareAltOutlined />}
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/tasks/detail/${task._id}`,
                      );
                      message.success('Copied link to clipboard');
                    } catch (error) {
                      message.error('Copy link failed');
                    }
                  }}
                />
              </Tooltip>
            </div>
          </Space>

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
                    label: (
                      <ModalCreateTask initValue={task} type="update" onLoad={() => onLoad()} />
                    ),
                    key: 'edit',
                  },
                  {
                    label: 'Delete',
                    key: 'delete',
                    onClick: async () => onDeleteTask(task._id),
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

export default ToDoCard;
