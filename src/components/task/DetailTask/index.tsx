import { commentTask, getTask } from '@/services/task';
import { formatDate } from '@/utils';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Col, Collapse, Divider, Drawer, Flex, Row } from 'antd';
import { useEffect, useState } from 'react';
import PriorityTask from '../PriorityTask';
import StatusTask from '../StatusTask';

type DetailTaskProps = {
  visible: boolean;
  onClose: () => void;
};

const DetailTask = ({ visible, onClose }: DetailTaskProps) => {
  const taskId = history.location.search.split('=')[1];
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<any>();

  const getTaskDetail = async () => {
    setLoading(true);
    try {
      const response = await getTask(taskId);
      console.log(response);
      if (response.errorCode === 0) {
        setTask(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetail();
    }
  }, [taskId]);
  console.log(task);

  return (
    <Drawer
      open={visible}
      onClose={onClose}
      loading={loading}
      width={400}
      title={`Task detail: ${task?.name}`}
      footer={
        task?.state === 'approve' && (
          <div>
            <Flex gap="small" style={{ width: '100%' }}>
              <Button type="primary" block size="small">
                Accept
              </Button>
              <Button danger type="primary" block size="small">
                Reject
              </Button>
            </Flex>
          </div>
        )
      }
    >
      <div>{task?.description}</div>
      <Collapse defaultActiveKey={['1']} ghost size="small">
        <Collapse.Panel
          header={<strong>Detail</strong>}
          key="1"
          style={{ paddingInlineStart: 0, padding: 0 }}
        >
          <Row>
            <Col span={6}>Status: </Col>
            <Col span={18}>
              <StatusTask value={task?.status} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>Priority: </Col>
            <Col span={18}>{<PriorityTask value={task?.priority} />}</Col>
          </Row>
        </Collapse.Panel>
        <Collapse.Panel header={<strong>Dates</strong>} key="2">
          <Row>
            <Col span={6}>Created at: </Col>
            <Col span={18}>{formatDate(task?.createdAt)}</Col>
          </Row>
          <Row>
            <Col span={6}>Updated at: </Col>
            <Col span={18}>{formatDate(task?.updatedAt)}</Col>
          </Row>
        </Collapse.Panel>
        <Collapse.Panel header={<strong>Assigned</strong>} key="3">
          <Row>
            <Col span={6}>Assigned by: </Col>
            <Col span={18}>{task?.assigned_by?.username}</Col>
          </Row>
          <Row>
            <Col span={6}>Assigned to: </Col>
            <Col span={18}>{task?.assigned_to?.username}</Col>
          </Row>
        </Collapse.Panel>
      </Collapse>

      <Divider plain orientation="left">
        <strong>Comments</strong>
      </Divider>
      {task?.comments.map((comment: any) => (
        <div key={comment._id}>
          <strong>{comment?.user_id?.username}</strong>
          <div>{comment.content}</div>
          <Divider style={{ margin: '5px 0' }} />
        </div>
      ))}

      <ProForm
        onFinish={async (values: any) => {
          await commentTask(taskId, values.content);
          getTaskDetail();
        }}
      >
        <ProFormTextArea name="content" label="Comment" />
      </ProForm>
      {/* <Button type="default" icon={<CommentOutlined />}>
        Add Comment
      </Button> */}
    </Drawer>
  );
};

export default DetailTask;
