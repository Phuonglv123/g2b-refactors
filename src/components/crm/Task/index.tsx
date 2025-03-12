import ApproveCard from '@/components/task/ApproveCard';
import CompletedCard from '@/components/task/CompleteCard';
import FollowCard from '@/components/task/FollowCard';
import ProcessingCard from '@/components/task/ProcessingCard';
import ToDoCard from '@/components/task/ToDoCard';
import { updateStateTask } from '@/services/task';
import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Flex, Skeleton, Space } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styles from './style.less';

type TaskTabProps = {
  tasks: any[];
  id?: string;
  refresh?: () => void;
};
const TaskTab = ({ tasks = [], refresh }: TaskTabProps) => {
  const [loading, setLoading] = useState(false);
  const initialState: any = useModel('@@initialState');
  //   console.log(data);
  // if (!data?.length) {
  //   return <Empty />;
  // }

  const onDragEnd = async (result: any) => {
    const { destination, draggableId } = result;
    console.log(result);
    if (!destination) {
      return;
    }
    try {
      setLoading(true);
      const res = await updateStateTask(draggableId, destination.droppableId);
      console.log(res);
      if (refresh) {
        refresh();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProCard>
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
                                    if (refresh) {
                                      refresh();
                                    }
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
                                    if (refresh) {
                                      refresh();
                                    }
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
                                    if (refresh) {
                                      refresh();
                                    }
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
                                    if (refresh) {
                                      refresh();
                                    }
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
                                    if (refresh) {
                                      refresh();
                                    }
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
    </ProCard>
  );
};

export default TaskTab;
