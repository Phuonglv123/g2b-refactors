import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, Row } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Billing = () => {
  const [init, setInit] = useState([
    {
      id: '1',
      content: 'This is an initial item',
    },
    {
      id: '2',
      content: 'This is another initial item',
    },
  ]);
  const [processing, setProcessing] = useState([]);
  const [done, setDone] = useState([]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'init') {
        const items = [...init];
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setInit(items);
      } else if (source.droppableId === 'processing') {
        const items = [...processing];
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setProcessing(items);
      } else if (source.droppableId === 'done') {
        const items = [...done];
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setDone(items);
      }
    } else {
      if (source.droppableId === 'init') {
        const initItems = [...init];
        const processingItems = [...processing];
        const [reorderedItem] = initItems.splice(source.index, 1);
        processingItems.splice(destination.index, 0, reorderedItem);
        setInit(initItems);
        setProcessing(processingItems);
      } else if (source.droppableId === 'processing') {
        const processingItems = [...processing];
        const doneItems = [...done];
        const [reorderedItem] = processingItems.splice(source.index, 1);
        doneItems.splice(destination.index, 0, reorderedItem);
        setProcessing(processingItems);
        setDone(doneItems);
      } else if (source.droppableId === 'done') {
        const doneItems = [...done];
        const initItems = [...init];
        const [reorderedItem] = doneItems.splice(source.index, 1);
        initItems.splice(destination.index, 0, reorderedItem);
        setDone(doneItems);
        setInit(initItems);
      }
    }
  };

  return (
    <PageContainer
      title="Billing"
      extra={
        <Button type="primary" onClick={() => history.push('/billing/create')}>
          New Bill
        </Button>
      }
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          <Col span={8}>
            <ProCard title="Init Billing" style={{ marginBottom: 16 }} headerBordered>
              <Droppable droppableId="init">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {init.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ProCard bordered>{item.content}</ProCard>
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
          <Col span={8}>
            <ProCard title="Processing Billing" style={{ marginBottom: 16 }} headerBordered>
              <Droppable droppableId="processing">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {processing.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ProCard bordered>{item.content}</ProCard>
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
          <Col span={8}>
            <ProCard title="Done" style={{ marginBottom: 16 }} headerBordered>
              <Droppable droppableId="done">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {done.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ProCard bordered>{item.content}</ProCard>
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
    </PageContainer>
  );
};

export default Billing;
