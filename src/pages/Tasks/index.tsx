import ApproveCard from '@/components/task/ApproveCard';
import CompletedCard from '@/components/task/CompleteCard';
import DetailTask from '@/components/task/DetailTask';
import FollowCard from '@/components/task/FollowCard';
import ModalCreateTask from '@/components/task/ModalCreateTask';
import ProcessingCard from '@/components/task/ProcessingCard';
import StatusTask from '@/components/task/StatusTask';
import ToDoCard from '@/components/task/ToDoCard';
import { getTasks, updateStateTask } from '@/services/task';
import { listUser } from '@/services/user';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Col, Row, Space } from 'antd';
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

  return (
    <PageContainer title="Manager Tasks" extra={<ModalCreateTask onLoad={() => listingTask()} />}>
      <ProForm
        initialValues={{
          name: '',
          status: '',
          type: '',
          assigned_to: '',
        }}
        layout="inline"
        onFinish={async (values) => {
          console.log(values);
          const response = await getTasks(values);
          setTasks(response.data);
        }}
        onReset={() => {
          listingTask();
        }}
        style={{
          marginBottom: 16,
        }}
      >
        <ProForm.Group>
          <ProFormText name="name" label="Name" width="lg" />
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
        <Row gutter={8}>
          <Col span={5}>
            <ProCard title="Todo" bodyStyle={{ padding: 8, height: '75vh', overflow: 'auto' }}>
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
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard
              title="In progress"
              bodyStyle={{ padding: 8, height: '75vh', overflow: 'auto' }}
            >
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
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard title="Approve" bodyStyle={{ padding: 8, height: '75vh', overflow: 'auto' }}>
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
            </ProCard>
          </Col>
          <Col span={5}>
            <ProCard title="Follow" bodyStyle={{ padding: 8, height: '75vh', overflow: 'auto' }}>
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
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="Completed" bodyStyle={{ padding: 8, height: '75vh', overflow: 'auto' }}>
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
                          isDragDisabled={true}
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
