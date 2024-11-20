import DetailTask from '@/components/task/DetailTask';
import ModalCreateTask from '@/components/task/ModalCreateTask';
import PriorityTask from '@/components/task/PriorityTask';
import StatusTask from '@/components/task/StatusTask';
import TypeTask from '@/components/task/TypeTask';
import { getTasks, updateStateTask } from '@/services/task';
import { getSrcImg } from '@/utils';
import { CommentOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Col, Flex, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { history } from 'umi';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);

  const listingTask = async () => {
    try {
      const response = await getTasks({});
      setTasks(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    listingTask();
  }, [visible]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    try {
      const res = await updateStateTask(draggableId, destination.droppableId);
      console.log(res);
      listingTask();
    } catch (error) {}
  };

  return (
    <PageContainer title="Manager Tasks" extra={<ModalCreateTask onLoad={() => listingTask()} />}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={8}>
          <Col span={5}>
            <ProCard title="Todo" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      .filter((task: any) => task.state === 'todo')
                      .map((task: any, index: number) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProCard key={task._id} bordered size="small">
                                <Row justify={'space-between'}>
                                  <Col>
                                    <Flex align="center" justify="start">
                                      <TypeTask value={task.type} />
                                      <div
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </div>
                                    </Flex>
                                  </Col>
                                  <Col>
                                    <Tooltip title={task.assigned_to?.username}>
                                      <Avatar
                                        src={getSrcImg(task?.assigned_to?.avatar)}
                                        icon={<UserOutlined />}
                                      />
                                    </Tooltip>
                                  </Col>
                                </Row>
                                <div>{task?.description}</div>
                                <br />
                                <div>
                                  <Space>
                                    <PriorityTask value={task.priority} />
                                    <StatusTask value={task.status} />
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {task.comments?.length} <CommentOutlined />
                                    </div>
                                    <div>
                                      <Button
                                        type="primary"
                                        size="small"
                                        onClick={async () => {
                                          await updateStateTask(task._id, 'in_progress');
                                        }}
                                      >
                                        recept
                                      </Button>
                                    </div>
                                  </Space>
                                </div>
                              </ProCard>
                              <br />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard title="In Processing" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="in_progress">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'in_progress')
                      .map((task: any, index: number) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProCard
                                key={task._id}
                                bordered
                                size="small"
                                onClick={() => {
                                  setVisible(true);
                                  task;
                                }}
                              >
                                <Row justify={'space-between'}>
                                  <Col>
                                    <Flex align="center" justify="start">
                                      <TypeTask value={task.type} />
                                      <div>{task.name?.toString().toUpperCase()}</div>
                                    </Flex>
                                  </Col>
                                  <Col>
                                    <Tooltip title={task.assigned_to?.username}>
                                      <Avatar icon={<UserOutlined />} />
                                    </Tooltip>
                                  </Col>
                                </Row>
                                <div>{task?.description}</div>
                                <br />
                                <div>
                                  <Space>
                                    <PriorityTask value={task.priority} />
                                    <StatusTask value={task.status} />
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {task.comments?.length} <CommentOutlined />
                                    </div>
                                  </Space>
                                </div>
                              </ProCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard title="Approve" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="approve">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'approve')
                      .map((task: any, index: number) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProCard
                                key={task._id}
                                bordered
                                size="small"
                                onClick={() => {
                                  setVisible(true);
                                  task;
                                }}
                              >
                                <Row justify={'space-between'}>
                                  <Col>
                                    <div>{task.name?.toString().toUpperCase()}</div>
                                  </Col>
                                  <Col>
                                    <Tooltip title={task.assigned_to?.username}>
                                      <Avatar icon={<UserOutlined />} />
                                    </Tooltip>
                                  </Col>
                                </Row>
                                <div>{task?.description}</div>
                                <br />
                                <div>
                                  <Space>
                                    <PriorityTask value={task.priority} />
                                    <StatusTask value={task.status} />
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {task.comments?.length} <CommentOutlined />
                                    </div>
                                  </Space>
                                </div>
                              </ProCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard title="Follow" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="follow">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'follow')
                      .map((task: any, index: number) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProCard
                                key={task._id}
                                bordered
                                size="small"
                                onClick={() => {
                                  setVisible(true);
                                  task;
                                }}
                              >
                                <Row justify={'space-between'}>
                                  <Col>
                                    <div>{task.name?.toString().toUpperCase()}</div>
                                  </Col>
                                  <Col>
                                    <Tooltip title={task.assigned_to?.username}>
                                      <Avatar icon={<UserOutlined />} />
                                    </Tooltip>
                                  </Col>
                                </Row>
                                <div>{task?.description}</div>
                                <br />
                                <div>
                                  <Space>
                                    <PriorityTask value={task.priority} />
                                    <StatusTask value={task.status} />
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {task.comments?.length} <CommentOutlined />
                                    </div>
                                  </Space>
                                </div>
                              </ProCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>

          <Col span={4}>
            <ProCard title="Completed" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="completed">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'completed')
                      .map((task: any, index: number) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProCard
                                key={task._id}
                                bordered
                                size="small"
                                onClick={() => {
                                  setVisible(true);
                                  task;
                                }}
                              >
                                <Row justify={'space-between'}>
                                  <Col>
                                    <div>{task.name?.toString().toUpperCase()}</div>
                                  </Col>
                                  <Col>
                                    <Tooltip title={task.assigned_to?.username}>
                                      <Avatar icon={<UserOutlined />} />
                                    </Tooltip>
                                  </Col>
                                </Row>
                                <div>{task?.description}</div>
                                <br />
                                <div>
                                  <Space>
                                    <PriorityTask value={task.priority} />
                                    <StatusTask value={task.status} />
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {task.comments?.length} <CommentOutlined />
                                    </div>
                                  </Space>
                                </div>
                              </ProCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
        </Row>
      </DragDropContext>
      <DetailTask
        visible={visible}
        onClose={() => {
          history.push('/tasks');
          getTasks({});
          setVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default TaskPage;
