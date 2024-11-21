import DetailTask from '@/components/task/DetailTask';
import ModalCreateTask from '@/components/task/ModalCreateTask';
import PriorityTask from '@/components/task/PriorityTask';
import StatusTask from '@/components/task/StatusTask';
import TypeTask from '@/components/task/TypeTask';
import { getTasks, updateStateTask, updateStatusTask } from '@/services/task';
import { getSrcImg } from '@/utils';
import { CommentOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Col, Dropdown, Flex, Row, Select, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { history } from 'umi';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const { initialState } = useModel('@@initialState');

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
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.assigned_to?._id === initialState?.currentUser?._id &&
                            task.status !== 'no_response'
                              ? false
                              : true
                          }
                        >
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
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </Button>
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

                                <br />
                                <div>
                                  <Flex gap={12} align="center" justify="space-between">
                                    <strong>Priority:</strong>
                                    <Select
                                      value={task.priority}
                                      style={{ width: 150 }}
                                      size="middle"
                                      options={[
                                        {
                                          label: <PriorityTask value={'low'} />,
                                          value: 'low',
                                        },
                                        {
                                          label: <PriorityTask value={'medium'} />,
                                          value: 'medium',
                                        },
                                        {
                                          label: <PriorityTask value={'high'} />,
                                          value: 'high',
                                        },
                                      ]}
                                    />
                                  </Flex>

                                  <Flex
                                    gap={12}
                                    align="center"
                                    justify="space-between"
                                    style={{ marginTop: 4 }}
                                  >
                                    <strong>Status:</strong>
                                    <Select
                                      value={task.status}
                                      style={{ width: 150 }}
                                      size="middle"
                                      onChange={async (value) => {
                                        try {
                                          await updateStatusTask(task._id, value);
                                          listingTask();
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
                                      ]}
                                    />
                                  </Flex>
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
                                                    (task.status === 'no_response' &&
                                                      'Change status to receive task') ||
                                                    (initialState?.currentUser?._id !==
                                                      task.assigned_to?._id &&
                                                      'You are not assigned to this task')
                                                  }
                                                >
                                                  Receive
                                                </Tooltip>
                                              ),
                                              key: 'receive',
                                              onClick: async () => {
                                                await updateStateTask(task._id, 'in_progress');
                                                listingTask();
                                              },
                                              disabled:
                                                task.assigned_to?._id ===
                                                  initialState?.currentUser?._id &&
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
                                                await updateStateTask(task._id, 'delete');
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
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.assigned_to?._id === initialState?.currentUser?._id &&
                            task.status !== 'no_response'
                              ? false
                              : true
                          }
                        >
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
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </Button>
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

                                <br />
                                <div>
                                  <Flex gap={12} align="center" justify="space-between">
                                    <strong>Priority:</strong>
                                    <Select
                                      value={task.priority}
                                      style={{ width: 150 }}
                                      size="middle"
                                      options={[
                                        {
                                          label: <PriorityTask value={'low'} />,
                                          value: 'low',
                                        },
                                        {
                                          label: <PriorityTask value={'medium'} />,
                                          value: 'medium',
                                        },
                                        {
                                          label: <PriorityTask value={'high'} />,
                                          value: 'high',
                                        },
                                      ]}
                                    />
                                  </Flex>

                                  <Flex
                                    gap={12}
                                    align="center"
                                    justify="space-between"
                                    style={{ marginTop: 4 }}
                                  >
                                    <strong>Status:</strong>
                                    <Select
                                      value={task.status}
                                      style={{ width: 150 }}
                                      size="middle"
                                      onChange={async (value) => {
                                        try {
                                          await updateStatusTask(task._id, value);
                                          listingTask();
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
                                      ]}
                                    />
                                  </Flex>
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
                                                    (task.status === 'no_response' &&
                                                      'Change status to receive task') ||
                                                    (initialState?.currentUser?._id !==
                                                      task.assigned_to?._id &&
                                                      'You are not assigned to this task')
                                                  }
                                                >
                                                  Receive
                                                </Tooltip>
                                              ),
                                              key: 'receive',
                                              onClick: async () => {
                                                await updateStateTask(task._id, 'in_progress');
                                                listingTask();
                                              },
                                              disabled:
                                                task.assigned_to?._id ===
                                                  initialState?.currentUser?._id &&
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
                                                await updateStateTask(task._id, 'delete');
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
            <ProCard title="Approve" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="approve">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'approve')
                      .map((task: any, index: number) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.assigned_to?._id === initialState?.currentUser?._id &&
                            task.status !== 'no_response'
                              ? false
                              : true
                          }
                        >
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
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </Button>
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

                                <br />
                                <div>
                                  <Flex gap={12} align="center" justify="space-between">
                                    <strong>Priority:</strong>
                                    <Select
                                      value={task.priority}
                                      style={{ width: 150 }}
                                      size="middle"
                                      options={[
                                        {
                                          label: <PriorityTask value={'low'} />,
                                          value: 'low',
                                        },
                                        {
                                          label: <PriorityTask value={'medium'} />,
                                          value: 'medium',
                                        },
                                        {
                                          label: <PriorityTask value={'high'} />,
                                          value: 'high',
                                        },
                                      ]}
                                    />
                                  </Flex>

                                  <Flex
                                    gap={12}
                                    align="center"
                                    justify="space-between"
                                    style={{ marginTop: 4 }}
                                  >
                                    <strong>Status:</strong>
                                    <Select
                                      value={task.status}
                                      style={{ width: 150 }}
                                      size="middle"
                                      onChange={async (value) => {
                                        try {
                                          await updateStatusTask(task._id, value);
                                          listingTask();
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
                                      ]}
                                    />
                                  </Flex>
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
                                                    (task.status === 'no_response' &&
                                                      'Change status to receive task') ||
                                                    (initialState?.currentUser?._id !==
                                                      task.assigned_to?._id &&
                                                      'You are not assigned to this task')
                                                  }
                                                >
                                                  Receive
                                                </Tooltip>
                                              ),
                                              key: 'receive',
                                              onClick: async () => {
                                                await updateStateTask(task._id, 'in_progress');
                                                listingTask();
                                              },
                                              disabled:
                                                task.assigned_to?._id ===
                                                  initialState?.currentUser?._id &&
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
                                                await updateStateTask(task._id, 'delete');
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
            <ProCard title="Follow" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="follow">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'follow')
                      .map((task: any, index: number) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.assigned_to?._id === initialState?.currentUser?._id &&
                            task.status !== 'no_response'
                              ? false
                              : true
                          }
                        >
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
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </Button>
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

                                <br />
                                <div>
                                  <Flex gap={12} align="center" justify="space-between">
                                    <strong>Priority:</strong>
                                    <Select
                                      value={task.priority}
                                      style={{ width: 150 }}
                                      size="middle"
                                      options={[
                                        {
                                          label: <PriorityTask value={'low'} />,
                                          value: 'low',
                                        },
                                        {
                                          label: <PriorityTask value={'medium'} />,
                                          value: 'medium',
                                        },
                                        {
                                          label: <PriorityTask value={'high'} />,
                                          value: 'high',
                                        },
                                      ]}
                                    />
                                  </Flex>

                                  <Flex
                                    gap={12}
                                    align="center"
                                    justify="space-between"
                                    style={{ marginTop: 4 }}
                                  >
                                    <strong>Status:</strong>
                                    <Select
                                      value={task.status}
                                      style={{ width: 150 }}
                                      size="middle"
                                      onChange={async (value) => {
                                        try {
                                          await updateStatusTask(task._id, value);
                                          listingTask();
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
                                      ]}
                                    />
                                  </Flex>
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
                                                    (task.status === 'no_response' &&
                                                      'Change status to receive task') ||
                                                    (initialState?.currentUser?._id !==
                                                      task.assigned_to?._id &&
                                                      'You are not assigned to this task')
                                                  }
                                                >
                                                  Receive
                                                </Tooltip>
                                              ),
                                              key: 'receive',
                                              onClick: async () => {
                                                await updateStateTask(task._id, 'in_progress');
                                                listingTask();
                                              },
                                              disabled:
                                                task.assigned_to?._id ===
                                                  initialState?.currentUser?._id &&
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
                                                await updateStateTask(task._id, 'delete');
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

          <Col span={4}>
            <ProCard title="Completed" bodyStyle={{ padding: 8, height: '70vh' }}>
              <Droppable droppableId="completed">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter((task: any) => task.state === 'completed')
                      .map((task: any, index: number) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.assigned_to?._id === initialState?.currentUser?._id &&
                            task.status !== 'no_response'
                              ? false
                              : true
                          }
                        >
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
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          history.push(`/tasks?id=${task._id}`);
                                          setVisible(true);
                                        }}
                                      >
                                        {task.name?.toString().toUpperCase()}
                                      </Button>
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

                                <br />
                                <div>
                                  <Flex gap={12} align="center" justify="space-between">
                                    <strong>Priority:</strong>
                                    <Select
                                      value={task.priority}
                                      style={{ width: 150 }}
                                      size="middle"
                                      options={[
                                        {
                                          label: <PriorityTask value={'low'} />,
                                          value: 'low',
                                        },
                                        {
                                          label: <PriorityTask value={'medium'} />,
                                          value: 'medium',
                                        },
                                        {
                                          label: <PriorityTask value={'high'} />,
                                          value: 'high',
                                        },
                                      ]}
                                    />
                                  </Flex>

                                  <Flex
                                    gap={12}
                                    align="center"
                                    justify="space-between"
                                    style={{ marginTop: 4 }}
                                  >
                                    <strong>Status:</strong>
                                    <Select
                                      value={task.status}
                                      style={{ width: 150 }}
                                      size="middle"
                                      onChange={async (value) => {
                                        try {
                                          await updateStatusTask(task._id, value);
                                          listingTask();
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
                                      ]}
                                    />
                                  </Flex>
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
                                                    (task.status === 'no_response' &&
                                                      'Change status to receive task') ||
                                                    (initialState?.currentUser?._id !==
                                                      task.assigned_to?._id &&
                                                      'You are not assigned to this task')
                                                  }
                                                >
                                                  Receive
                                                </Tooltip>
                                              ),
                                              key: 'receive',
                                              onClick: async () => {
                                                await updateStateTask(task._id, 'in_progress');
                                                listingTask();
                                              },
                                              disabled:
                                                task.assigned_to?._id ===
                                                  initialState?.currentUser?._id &&
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
                                                await updateStateTask(task._id, 'delete');
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
