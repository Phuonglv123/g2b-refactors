import { reactionComment, replyComment } from '@/services/comments';
import { formatDate, getSrcImg } from '@/utils';
import {
  DislikeTwoTone,
  FrownTwoTone,
  HeartTwoTone,
  LikeTwoTone,
  MehTwoTone,
  SmileTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Divider, Flex, Image, Space, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import CommentEditor from '../CommentEditor';

const renderWithTags = (text: string) => {
  const parts = text.split(/(\@\w+)/); // Split text into mentions and non-mentions
  return parts.map((part: any, index: any) => {
    if (part.startsWith('@')) {
      const mention = part.slice(1); // Remove '@' symbol
      return (
        <Tag key={index} color="blue">
          {mention}
        </Tag>
      );
    }
    return part; // Return non-mention parts as-is
  });
};

const detectLinkInComment = (text: string) => {
  const parts = text.split(/(https?:\/\/[^\s]+)/); // Split text into links and non-links
  return parts.map((part: any, index: any) => {
    if (part.startsWith('https://')) {
      return (
        <a key={index} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }
    return renderWithTags(part); // Return non-link parts as-is
  });
};

const ShowCommentTask = ({ comments, refresh }: { comments: any; refresh: any }) => {
  const [replyId, setReplyId] = useState('');
  const [isIndex, setIsIndex] = useState<any>(null);
  const onClickReactionComment = async (id: string, type: string) => {
    try {
      await reactionComment(id, { type });
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const onClickReplyComment = async () => {
    // if (!replyId) {
    //   return;
    // }
    try {
      await replyComment('', { content: '' });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(comments);

  return (
    <div>
      {comments?.map((comment: any, index: number) => (
        <div key={comment._id}>
          <Flex align="center" justify="space-between">
            <Flex gap={4} align="center">
              <Avatar
                src={getSrcImg(comment?.user_id?.avatar)}
                icon={<UserOutlined />}
                size="small"
              />
              <div>
                <strong>{comment?.user_id?.username}</strong>
              </div>
            </Flex>
            <div style={{ fontSize: 10 }}>
              <strong>{formatDate(comment.createdAt)}</strong>
            </div>
          </Flex>

          <div style={{ marginTop: 8 }}>{detectLinkInComment(comment.content)}</div>
          <br />
          <Space>
            {comment.attachments?.map((attachment: any) => (
              <Image key={attachment} src={getSrcImg(attachment)} width={50} height={50} />
            ))}
          </Space>
          {replyId && index === isIndex && (
            <CommentEditor taskId={replyId} onLoad={() => refresh()} reply />
          )}
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
                setIsIndex(index);
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
                  <Avatar
                    src={getSrcImg(child?.user_id?.avatar)}
                    icon={<UserOutlined />}
                    size="small"
                  />
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

                {/* <Button
                  size="small"
                  type="text"
                  // onClick={() => {
                  //   setReplyId(child._id);
                  // }}
                >
                  Reply
                </Button> */}
              </Flex>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowCommentTask;
