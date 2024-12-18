import { createComment, reactionComment, replyComment } from '@/services/comments';
import { getTask } from '@/services/task';
import { formatDate } from '@/utils';
import {
  CommentOutlined,
  DislikeTwoTone,
  FrownTwoTone,
  HeartTwoTone,
  LikeTwoTone,
  MehTwoTone,
  SmileTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Avatar, Button, Col, Collapse, Divider, Drawer, Flex, Row, Tooltip } from 'antd';

import { Mention } from 'react-mentions';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useState } from 'react';
import PriorityTask from '../PriorityTask';
import StatusTask from '../StatusTask';

const atValues = [
  { id: 1, value: 'Fredrik Sundqvist' },
  { id: 2, value: 'Patrik Sjölin' },
];
const hashValues = [
  { id: 3, value: 'Fredrik Sundqvist 2' },
  { id: 4, value: 'Patrik Sjölin 2' },
];

type DetailTaskProps = {
  visible: boolean;
  onClose: () => void;
};

const DetailTask = ({ visible, onClose }: DetailTaskProps) => {
  const taskId = history.location.search.split('=')[1];
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<any>();
  const [comment, setComment] = useState('');
  const [replyId, setReplyId] = useState(null);
  const [isComment, setIsComment] = useState(false);

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

  const onClickReactionComment = async (id: string, type: string) => {
    try {
      await reactionComment(id, { type });
      getTaskDetail();
    } catch (error) {
      console.log(error);
    }
  };

  const onClickReplyComment = async () => {
    if (!replyId) {
      return;
    }
    try {
      await replyComment(replyId, { content: comment });
      getTaskDetail();
    } catch (error) {
      console.log(error);
    }
  };

  const onClickAddComment = async () => {
    try {
      await createComment({ task_id: taskId, content: comment });
      getTaskDetail();
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (taskId) {
  //     getTaskDetail();
  //   }
  // }, [taskId]);
  console.log(task);

  const modules = {
    toolbar: [['link', 'image']],
  };

  return (
    <Drawer
      open={taskId ? true : false}
      onClose={onClose}
      loading={loading}
      width={800}
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
      <Collapse defaultActiveKey={['1', '2', '3']} ghost size="small">
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
      <div style={{ height: 480, maxHeight: 480, overflow: 'auto' }}>
        {task?.comments?.map((comment: any) => (
          <div key={comment._id}>
            <Flex align="center" justify="space-between">
              <Flex gap={4} align="center">
                <Avatar icon={<UserOutlined />} size="small" />
                <div>
                  <strong>{comment?.user_id?.username}</strong>
                </div>
              </Flex>
              <div style={{ fontSize: 10 }}>
                <strong>{formatDate(comment.createdAt)}</strong>
              </div>
            </Flex>
            <div
              className="custom-img"
              style={{ margin: 10 }}
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            <Flex gap={6} justify="space-between">
              <Flex gap={4}>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'like')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'like')}
                    size="small"
                    icon={
                      <LikeTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'like').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'like').length}
                  </Button>
                </Tooltip>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'dislike')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'dislike')}
                    size="small"
                    icon={
                      <DislikeTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'dislike').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'dislike').length}
                  </Button>
                </Tooltip>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'love')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'love')}
                    size="small"
                    icon={
                      <HeartTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'love').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'love').length}
                  </Button>
                </Tooltip>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'laugh')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'laugh')}
                    size="small"
                    icon={
                      <SmileTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'laugh').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'laugh').length}
                  </Button>
                </Tooltip>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'angry')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'angry')}
                    size="small"
                    icon={
                      <MehTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'angry').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'angry').length}
                  </Button>
                </Tooltip>
                <Tooltip
                  title={comment.reactions
                    .filter((r: any) => r.type === 'sad')
                    .map((r: any) => r.user_id.username)
                    .join(', ')}
                >
                  <Button
                    onClick={() => onClickReactionComment(comment._id, 'sad')}
                    size="small"
                    icon={
                      <FrownTwoTone
                        twoToneColor={
                          comment.reactions.filter((r: any) => r.type === 'sad').length > 0
                            ? '#febd21'
                            : '#33333'
                        }
                      />
                    }
                    type="text"
                  >
                    {comment.reactions.filter((r: any) => r.type === 'sad').length}
                  </Button>
                </Tooltip>
              </Flex>

              <Button
                size="small"
                type="text"
                onClick={() => {
                  setReplyId(comment._id);
                }}
              >
                Reply
              </Button>
            </Flex>
            <Divider style={{ margin: '5px 0' }} />
            {comment.children?.map((child: any) => (
              <div key={child._id} style={{ padding: 20 }}>
                <Flex align="center" justify="space-between">
                  <Flex gap={4} align="center">
                    <Avatar icon={<UserOutlined />} size="small" />
                    <div>
                      <strong>{child?.user_id?.username}</strong>
                    </div>
                  </Flex>
                  <div style={{ fontSize: 10 }}>
                    <strong>{formatDate(child.createdAt)}</strong>
                  </div>
                </Flex>
                <div
                  className="custom-img"
                  style={{ margin: 10 }}
                  dangerouslySetInnerHTML={{ __html: child.content }}
                />
                <Flex gap={6} justify="space-between">
                  <Flex gap={4}>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'like')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'like')}
                        size="small"
                        icon={
                          <LikeTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'like').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'like').length}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'dislike')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'dislike')}
                        size="small"
                        icon={
                          <DislikeTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'dislike').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'dislike').length}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'love')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'love')}
                        size="small"
                        icon={
                          <HeartTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'love').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'love').length}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'laugh')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'laugh')}
                        size="small"
                        icon={
                          <SmileTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'laugh').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'laugh').length}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'angry')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'angry')}
                        size="small"
                        icon={
                          <MehTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'angry').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'angry').length}
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={child.reactions
                        .filter((r: any) => r.type === 'sad')
                        .map((r: any) => r.user_id.username)
                        .join(', ')}
                    >
                      <Button
                        onClick={() => onClickReactionComment(child._id, 'sad')}
                        size="small"
                        icon={
                          <FrownTwoTone
                            twoToneColor={
                              child.reactions.filter((r: any) => r.type === 'sad').length > 0
                                ? '#febd21'
                                : '#33333'
                            }
                          />
                        }
                        type="text"
                      >
                        {child.reactions.filter((r: any) => r.type === 'sad').length}
                      </Button>
                    </Tooltip>
                  </Flex>

                  <Button
                    size="small"
                    type="text"
                    onClick={() => {
                      setReplyId(child._id);
                    }}
                  >
                    Reply
                  </Button>
                </Flex>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <ReactQuill
          theme="snow"
          value={comment}
          onChange={setComment}
          style={{ height: 200, maxHeight: 200, marginBottom: 60 }}
          modules={modules}
        >
          <Mention trigger="@" data={[{ id: '1', display: 'John Doe' }]} />
        </ReactQuill>

        <Button
          type="primary"
          icon={<CommentOutlined />}
          onClick={async () => {
            if (replyId) {
              await onClickReplyComment();
            } else {
              await onClickAddComment();
            }
            setComment('');
            setIsComment(false);
          }}
        >
          Add Comment
        </Button>
      </div>
      {/* {replyId && (
        <div>
          <ReactQuill
            theme="snow"
            value={comment}
            onChange={setComment}
            style={{ height: 200, maxHeight: 200, marginBottom: 60 }}
            modules={modules}
          />

          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={async () => {
              if (replyId) {
                await onClickReplyComment();
              } else {
                await onClickAddComment();
              }
              setComment('');
              setIsComment(false);
            }}
          >
            Add Comment
          </Button>
        </div>
      )} */}
      {!isComment && (
        <Button
          type="primary"
          onClick={() => {
            setIsComment(true);
            setReplyId(null);
          }}
        >
          Add Comment
        </Button>
      )}
    </Drawer>
  );
};

export default DetailTask;
