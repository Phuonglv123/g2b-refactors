import ApproveCard from '@/components/task/ApproveCard';
import CompletedCard from '@/components/task/CompleteCard';
import FollowCard from '@/components/task/FollowCard';
import ModalCreateTask from '@/components/task/ModalCreateTask';
import ProcessingCard from '@/components/task/ProcessingCard';
import StatusTask from '@/components/task/StatusTask';
import ToDoCard from '@/components/task/ToDoCard';
import { getTasks, updateStateTask } from '@/services/task';
import { listUser } from '@/services/user';
import { PageContainer, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { history, useLocation, useModel } from '@umijs/max';
import { Flex, Skeleton, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styles from './style.less';

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const query = useQuery();
  const [loading, setLoading] = useState(false);

  const listingTask = async () => {
    try {
      setLoading(true);
      const name = query.get('name');
      const status = query.get('status');
      console.log(status);
      const type = query.get('type');
      const assigned_to = query.get('assigned_to');
      const response = await getTasks({ name, status, type, assigned_to });
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listingTask();
  }, [
    visible,
    query.get('name'),
    query.get('status'),
    query.get('type'),
    query.get('assigned_to'),
  ]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    console.log(result);
    if (!destination) {
      return;
    }
    try {
      const res = await updateStateTask(draggableId, destination.droppableId);
      console.log(res);
      listingTask();
    } catch (error) {}
  };

  const listUserSuggestions = async () => {
    const res: any = await listUser({ page: 1, size: 1000 });
    return res?.data.map((user: any) => ({ value: user._id, label: user.username }));
  };

  const onFinish = async (values: any) => {
    if (values) {
      const { name, status, type, assigned_to } = values;

      history.push({
        pathname: '/tasks',
        search: `?${name && `name=${name}`}${status && `status=${status}`}${
          type && `type=${type}`
        }${assigned_to && `assigned_to=${assigned_to}`}`,
      });
      const response = await getTasks(values);
      setTasks(response.data);
    }
  };

  return (
    <PageContainer title="Manager Tasks" extra={<ModalCreateTask onLoad={() => listingTask()} />}>
      <ProForm
        initialValues={{
          name: query.get('name') || '',
          status: query.get('status') || '',
          type: query.get('type') || '',
          assigned_to: query.get('assigned_to') || '',
        }}
        loading={loading}
        layout="vertical"
        onFinish={onFinish}
        labelCol={{ span: 12 }}
        onReset={() => {
          history.push('/tasks');
          listingTask();
        }}
        submitter={{
          searchConfig: {
            submitText: 'Search',
          },
        }}
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <ProForm.Group>
          <ProFormText name="name" label="Name" width="sm" />
          <ProFormSelect
            name="status"
            label="Status"
            width="sm"
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
          <ProFormSelect
            name="type"
            label="Type"
            options={[
              { label: 'Task', value: 'task' },
              { label: 'Project', value: 'project' },
              { label: 'Target', value: 'target' },
              { label: 'Brief', value: 'brief' },
            ]}
            placeholder={'Select type'}
            width={'sm'}
          />
          <ProFormSelect
            name="assigned_to"
            label="Assigned to"
            request={listUserSuggestions}
            width="sm"
          />
        </ProForm.Group>
      </ProForm>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex gap={16} style={{ width: '100%', overflowX: 'auto' }}>
          <div className={styles.TaskDrag}>
            <div className={styles.TaskDragCard}>
              <div className={styles.TaskDragTitle}>
                <div>Todo</div>
                <div>{tasks.filter((task: any) => task.state === 'todo').length + ' items'}</div>
              </div>
              {loading ? (
                <Skeleton active />
              ) : (
                <Droppable droppableId="todo" key={'todo'} type="dropZone">
                  {(provided) => (
                    <Space
                      direction="vertical"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '100%',
                        background: '#37373799',
                        padding: '8px',
                        width: '100%',
                      }}
                    >
                      {tasks
                        .filter((task: any) => task.state === 'todo')
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={
                              !initialState?.currentUser?.role.find((i: any) => i === 'admin') &&
                              !task.assigned_to
                                ?.map((user: any) => user._id)
                                .includes(initialState?.currentUser?._id)
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ToDoCard
                                  task={task}
                                  key={task?._id}
                                  onLoad={() => {
                                    listingTask();
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Space>
                  )}
                </Droppable>
              )}
            </div>
          </div>
          <div className={styles.TaskDrag}>
            <div className={styles.TaskDragCard}>
              <div className={styles.TaskDragTitle}>
                <div>In progress</div>
                <div>
                  {tasks.filter((task: any) => task.state === 'in_progress').length + ' items'}
                </div>
              </div>
              {loading ? (
                <Skeleton active />
              ) : (
                <Droppable droppableId="in_progress" key={'in_progress'} type="dropZone">
                  {(provided) => (
                    <Space
                      direction="vertical"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '100%',
                        background: '#37373799',
                        padding: '8px',
                        width: '100%',
                      }}
                    >
                      {tasks
                        .filter((task: any) => task.state === 'in_progress')
                        .sort((a: any, b: any) => a.updatedAt - b.updatedAt)
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={
                              !initialState?.currentUser?.role.find((i: any) => i === 'admin') &&
                              !task.assigned_to
                                ?.map((user: any) => user._id)
                                .includes(initialState?.currentUser?._id)
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ProcessingCard
                                  task={task}
                                  key={task?._id}
                                  onLoad={() => {
                                    listingTask();
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Space>
                  )}
                </Droppable>
              )}
            </div>
          </div>
          <div className={styles.TaskDrag}>
            <div className={styles.TaskDragCard}>
              <div className={styles.TaskDragTitle}>
                <div>Approve</div>
                <div>{tasks.filter((task: any) => task.state === 'approve').length + ' items'}</div>
              </div>
              {loading ? (
                <Skeleton active />
              ) : (
                <Droppable droppableId="approve" key={'approve'} type="dropZone">
                  {(provided) => (
                    <Space
                      direction="vertical"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '100%',
                        background: '#37373799',
                        padding: '8px',
                        width: '100%',
                      }}
                    >
                      {tasks
                        .filter((task: any) => task.state === 'approve')
                        .sort((a: any, b: any) => a.updatedAt - b.updatedAt)
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={
                              !initialState?.currentUser?.role.find((i: any) => i === 'admin') &&
                              !task.assigned_to
                                ?.map((user: any) => user._id)
                                .includes(initialState?.currentUser?._id)
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ApproveCard
                                  task={task}
                                  key={task?._id}
                                  onLoad={() => {
                                    listingTask();
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Space>
                  )}
                </Droppable>
              )}
            </div>
          </div>
          <div className={styles.TaskDrag}>
            <div className={styles.TaskDragCard}>
              <div className={styles.TaskDragTitle}>
                <div>Follow</div>
                <div>{tasks.filter((task: any) => task.state === 'follow').length + ' items'}</div>
              </div>
              {loading ? (
                <Skeleton active />
              ) : (
                <Droppable droppableId="follow" key={'follow'} type="dropZone">
                  {(provided) => (
                    <Space
                      direction="vertical"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '100%',
                        background: '#37373799',
                        padding: '8px',
                        width: '100%',
                      }}
                    >
                      {tasks
                        .filter((task: any) => task.state === 'follow')
                        .sort((a: any, b: any) => a.updatedAt - b.updatedAt)
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={
                              !initialState?.currentUser?.role.find((i: any) => i === 'admin') &&
                              !task.assigned_to
                                ?.map((user: any) => user._id)
                                .includes(initialState?.currentUser?._id)
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <FollowCard
                                  task={task}
                                  key={task?._id}
                                  onLoad={() => {
                                    listingTask();
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Space>
                  )}
                </Droppable>
              )}
            </div>
          </div>
          <div className={styles.TaskDrag}>
            <div className={styles.TaskDragCard}>
              <div className={styles.TaskDragTitle}>
                <div>Completed</div>
                <div>
                  {tasks.filter((task: any) => task.state === 'completed').length + ' items'}
                </div>
              </div>
              {loading ? (
                <Skeleton active />
              ) : (
                <Droppable droppableId="completed" key={'completed'} type="dropZone">
                  {(provided) => (
                    <Space
                      direction="vertical"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '100%',
                        background: '#37373799',
                        padding: '8px',
                        width: '100%',
                      }}
                    >
                      {tasks
                        .filter((task: any) => task.state === 'completed')
                        .sort((a: any, b: any) => a.updatedAt - b.updatedAt)
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                            isDragDisabled={
                              !initialState?.currentUser?.role.find(
                                (role: any) => role === 'admin',
                              ) || true
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <CompletedCard
                                  task={task}
                                  key={task?._id}
                                  onLoad={() => {
                                    listingTask();
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Space>
                  )}
                </Droppable>
              )}
            </div>
          </div>
        </Flex>
      </DragDropContext>
    </PageContainer>
  );
};

export default TaskPage;
