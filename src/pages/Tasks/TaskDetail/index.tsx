import PriorityTask from '@/components/task/PriorityTask';
import StatusTask from '@/components/task/StatusTask';
import TypeTask from '@/components/task/TypeTask';
import { getTask } from '@/services/task';
import { formatDate } from '@/utils';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';
import { Avatar, Col, Flex, Row, Space, Typography } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import logoG2b from '@/assets/logo.png';

const PageTaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }
  const { error, loading, data } = useRequest(() => getTask(id));

  return (
    <PageContainer loading={loading}>
      <ProCard
        title={
          <Flex gap={24} align="center">
            <Avatar src={data?.avatar || logoG2b} size={60} style={{ border: '1px solid #ccc' }} />
            <Space direction="vertical">
              <TypeTask value={data?.type} />
              <Typography.Title level={3}>{data?.name}</Typography.Title>
            </Space>
          </Flex>
        }
      >
        <Row>
          <Col span={18}>
            <Typography.Title level={3}>Detail</Typography.Title>
            <Row gutter={16}>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Code:</Typography.Text>
                    <Typography.Text strong>{data?.code}</Typography.Text>
                  </Flex>
                  {/* <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Type:</Typography.Text>
                    <TypeTask value={data?.type} />
                  </Flex> */}
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Status:</Typography.Text>
                    <StatusTask value={data?.status} />
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Priority:</Typography.Text>
                    <PriorityTask value={data?.priority} />
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Deadline:</Typography.Text>
                    <Typography.Text>{formatDate(data?.deadline)}</Typography.Text>
                  </Flex>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Typography.Title level={3}>People</Typography.Title>
            <Space direction="vertical">
              <Flex gap={8} justify="space-between">
                <Typography.Text strong>Assigned to:</Typography.Text>
                <Typography.Text>{data?.assigned_to?.username}</Typography.Text>
              </Flex>
              <Flex gap={8} justify="space-between">
                <Typography.Text strong>Assigned by:</Typography.Text>
                <Typography.Text>{data?.assigned_by?.username}</Typography.Text>
              </Flex>
              <Flex gap={8} justify="space-between">
                <Typography.Text strong>Created by:</Typography.Text>
                <Typography.Text>{data?.created_by?.username}</Typography.Text>
              </Flex>
            </Space>
          </Col>
        </Row>
        <Space direction="vertical">
          <Typography.Title level={3}>Description</Typography.Title>
          <ReactQuill
            theme="snow"
            value={data?.description}
            //           onChange={setComment}
            style={{ height: 200, maxHeight: 200, marginBottom: 60 }}
            readOnly={true}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
          />
        </Space>
      </ProCard>
    </PageContainer>
  );
};

export default PageTaskDetail;
