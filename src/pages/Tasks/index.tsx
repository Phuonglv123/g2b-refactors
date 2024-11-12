import { getTasks } from '@/services/task';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);

  const listingTask = async () => {
    try {
      const response = await getTasks({});
      setTasks(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    listingTask();
  }, []);

  return (
    <PageContainer title="Manager Tasks" extra={<Button type="primary">Create</Button>}>
      <DragDropContext onDragEnd={() => console.log(1)}>
        <Row gutter={8}>
          <Col span={4}>
            <ProCard title="requset_customer">
              <Droppable droppableId="requset_customer">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="quote">
              <Droppable droppableId="quote">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="negotiation">
              <Droppable droppableId="negotiation">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="won">
              <Droppable droppableId="won">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>

          <Col span={4}>
            <ProCard title="pending">
              <Droppable droppableId="pending">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
          <Col span={4}>
            <ProCard title="completed">
              <Droppable droppableId="completed">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: any, index: number) => (
                      <ProCard key={task._id} title={task.title} extra={task.status}>
                        {task.content}
                      </ProCard>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ProCard>
          </Col>
        </Row>
      </DragDropContext>
    </PageContainer>
  );
};

export default TaskPage;
