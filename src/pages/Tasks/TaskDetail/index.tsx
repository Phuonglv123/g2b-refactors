import PriorityTask from '@/components/task/PriorityTask';
import StatusTask from '@/components/task/StatusTask';
import TypeTask from '@/components/task/TypeTask';
import { getTask, updateStatusTask, updateTask } from '@/services/task';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Link, useParams, useRequest } from '@umijs/max';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import logoG2b from '@/assets/logo.png';
import CommentEditor from '@/components/task/CommentEditor';
import ShowCommentTask from '@/components/task/ShowCommentTask';
import DisplayUser from '@/components/user/DisplayUser';
import { listUser } from '@/services/user';
import { formatNumberVietnamese } from '@/utils';
import { CommentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const PageTaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isComment, setIsComment] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const listUserSuggestions = async () => {
    const res: any = await listUser({ page: 1, size: 1000 });
    setUserSuggestions(res?.data.map((user: any) => ({ label: user.username, value: user._id })));
  };

  useEffect(() => {
    listUserSuggestions();
  }, []);

  if (!id) {
    return null;
  }
  const { error, loading, data, refresh } = useRequest(() => getTask(id), {
    refreshDeps: [id],
  });

  console.log(data);
  console.log('data', error);
  const onUpdateDeadline = async (value: any) => {
    try {
      await updateTask(data._id, { deadline: value });
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateAssignTo = async (value: any) => {
    try {
      await updateTask(data._id, { assigned_to: value });
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateDescription = async () => {
    setIsLoading(true);
    try {
      await updateTask(data._id, { description: comment });
      refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer loading={loading}>
      <ProCard
        title={
          <Flex gap={24} align="center">
            <Avatar src={data?.avatar || logoG2b} size={40} style={{ border: '1px solid #ccc' }} />
            <Space direction="vertical">
              <TypeTask value={data?.type} />
              <Typography.Title level={3}>{data?.name}</Typography.Title>
            </Space>
          </Flex>
        }
        // bodyStyle={{
        //   maxHeight: 'calc(100vh - 200px)',
        // }}
      >
        <Row gutter={24}>
          <Col span={10} style={{ width: '100%' }}>
            <Divider orientation="left" variant="dashed">
              Overview
            </Divider>
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={24} style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Flex gap={8} justify="space-between" style={{ width: '100%' }}>
                    <Typography.Text strong>Code:</Typography.Text>
                    <Typography.Text strong>{data?.code}</Typography.Text>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Product:</Typography.Text>
                    <div>
                      {data?.product_id?.map((product: any) => (
                        <Tag key={product._id}>{product.product_name}</Tag>
                      ))}
                    </div>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Customer:</Typography.Text>
                    <Tag>{data?.business_id?.name}</Tag>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Areas:</Typography.Text>
                    <div>
                      {data?.areas?.map((area: any) => (
                        <Tag key={area}>{area}</Tag>
                      ))}
                    </div>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Currency:</Typography.Text>
                    <Typography.Text strong>{data?.currency}</Typography.Text>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Estimated budget :</Typography.Text>
                    <Typography.Text strong>
                      {formatNumberVietnamese(data?.estimated_budget)}
                    </Typography.Text>
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Status:</Typography.Text>
                    <Select
                      value={data?.status}
                      style={{ width: 150 }}
                      size="middle"
                      onChange={async (value) => {
                        try {
                          await updateStatusTask(data._id, value);
                          refresh();
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
                          label: <StatusTask value={'working'} />,
                          value: 'working',
                        },
                        {
                          label: <StatusTask value={'pending'} />,
                          value: 'pending',
                        },
                        {
                          label: <StatusTask value={'failed'} />,
                          value: 'failed',
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
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Priority:</Typography.Text>
                    <Select
                      style={{ width: 150 }}
                      value={data?.priority}
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

                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Deadline:</Typography.Text>
                    {/* <Typography.Text>{formatDate(data?.deadline)}</Typography.Text> */}
                    <DatePicker
                      defaultValue={data?.deadline ? dayjs(data?.deadline) : null}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime
                      onChange={onUpdateDeadline}
                    />
                  </Flex>
                </Space>
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Divider orientation="left" variant="dashed">
                    People
                  </Divider>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Assigned to:</Typography.Text>
                    <Select
                      options={userSuggestions}
                      value={data?.assigned_to?.map((user: any) => user._id)}
                      mode="multiple"
                      showSearch
                      onChange={onUpdateAssignTo}
                      style={{ width: 200 }}
                    />
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Assigned by:</Typography.Text>
                    {data?.assigned_by && <DisplayUser user={data?.assigned_by} />}
                  </Flex>
                  <Flex gap={8} justify="space-between">
                    <Typography.Text strong>Created by:</Typography.Text>
                    <DisplayUser user={data?.created_by} />
                  </Flex>
                  {data?.approved_by && (
                    <Flex justify="space-between">
                      <div>Approved by: </div>
                      <DisplayUser user={data?.approved_by} />
                    </Flex>
                  )}
                </Space>
              </Col>
            </Row>
            {data?.subTask?.length > 0 && (
              <Row>
                <Col span={24}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Divider orientation="left" variant="dashed">
                      Sub Task
                    </Divider>
                    <div>
                      {data?.subTask.map((subTask: any) => (
                        <ProCard bordered>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Flex gap={8} justify="space-between">
                              <Typography.Text strong>Name:</Typography.Text>
                              <Link to={`/tasks/${subTask?._id}`}>{subTask.name}</Link>
                            </Flex>
                            <Flex gap={8} justify="space-between">
                              <Typography.Text strong>Deadline:</Typography.Text>
                              <Typography.Text>
                                {dayjs(subTask.deadline).format('YYYY-MM-DD')}
                              </Typography.Text>
                            </Flex>
                            <Flex gap={8} justify="space-between">
                              <Typography.Text strong>Status:</Typography.Text>
                              <StatusTask value={subTask.status} />
                            </Flex>
                          </Space>
                        </ProCard>
                      ))}
                    </div>
                  </Space>
                </Col>
              </Row>
            )}
            <Row>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Divider orientation="left" variant="dashed">
                  Description
                </Divider>
                <ReactQuill
                  theme="snow"
                  value={!comment ? data?.description : comment}
                  onChange={setComment}
                  style={{ height: 200, maxHeight: 200, marginBottom: 60 }}
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
                <div style={{ width: 'fit-content', margin: '0 auto', marginTop: 8 }}>
                  <Button
                    size="small"
                    type="primary"
                    disabled={!comment}
                    loading={isLoading}
                    onClick={() => onUpdateDescription()}
                  >
                    Update
                  </Button>
                </div>
              </Space>
            </Row>
          </Col>
          <Col span={14}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <Typography.Title level={3}>Comments</Typography.Title>
                <Button
                  type="primary"
                  icon={<CommentOutlined />}
                  onClick={() => setIsComment(!isComment)}
                >
                  Add Comment
                </Button>
              </Flex>
              {isComment && <CommentEditor taskId={id} onLoad={() => refresh()} />}
              <div
                style={{
                  maxHeight: 600,
                  overflow: 'auto',
                }}
              >
                <ShowCommentTask comments={data?.comments} refresh={() => refresh()} />
              </div>
            </Space>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
};

export default PageTaskDetail;
