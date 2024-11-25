import logog2b from '@/assets/logo.png';
import { createComment } from '@/services/comments';
import { listUser } from '@/services/user';
import { getSrcImg } from '@/utils';
import { FileImageOutlined, SendOutlined, SmileTwoTone } from '@ant-design/icons';
import { Avatar, Button, Col, Image, Row, Space, Upload } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';

type CommentEditorProps = {
  taskId: string;
  onLoad: any;
};

const CommentEditor = ({ taskId, onLoad }: CommentEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Reference for emoji picker
  const [attachments, setAttachments] = useState([]);
  console.log(attachments);

  const onChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleEmojiClick = (emoji: any) => {
    setValue((prevValue) => prevValue + emoji.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  const handleClickOutside = (event: any) => {
    //@ts-ignore
    if (emojiPickerRef.current && !emojiPickerRef?.current?.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  const listUserSuggestions = async () => {
    const res: any = await listUser({ page: 1, size: 1000 });
    setUserSuggestions(
      res?.data.map((user: any) => ({ id: user._id, display: user.username, avatar: user.avatar })),
    );
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    listUserSuggestions();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const onSendComment = async () => {
    try {
      setLoading(true);
      await createComment({
        taskId: taskId,
        content: value,
        attachments: attachments,
      });
      setValue('');
      setAttachments([]);
      onLoad();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row align={'middle'} gutter={24}>
        <Col span={18}>
          <div style={{ position: 'relative' }}>
            <MentionsInput
              value={value}
              onChange={onChange}
              placeholder={"What's on your mind?"}
              style={{
                control: {
                  fontSize: 16,
                  fontWeight: 'normal',
                  color: 'white',
                  width: '100%',
                  padding: '6px',
                },
                highlighter: {
                  overflow: 'hidden',
                  color: 'white',
                },
                input: {
                  color: 'white',
                  width: '100%',
                  borderRadius: '8px',
                  padding: '6px',
                },
                suggestions: {
                  list: {
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontSize: 16,
                    color: 'black',
                  },
                  item: {
                    padding: '5px 15px',
                    borderBottom: '1px solid rgba(0,0,0,0.15)',
                    color: 'black',
                    '&focused': {
                      backgroundColor: '#cee4e5',
                    },
                  },
                },
              }}
            >
              <Mention
                trigger="@"
                displayTransform={(username, _id) => {
                  return `@${username}`;
                }}
                markup="@__display__"
                renderSuggestion={(suggestion: any, search, highlightedDisplay) => {
                  console.log(suggestion);
                  return (
                    <Space>
                      <Avatar src={suggestion.avatar ? getSrcImg(suggestion.avatar) : logog2b} />
                      {highlightedDisplay}
                    </Space>
                  );
                }}
                data={userSuggestions}
                regex={/@(\S+)/}
                style={{
                  backgroundColor: 'black',
                  color: 'black',
                }}
                appendSpaceOnAdd
              />
            </MentionsInput>
          </div>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef} // Attach ref to emoji picker
              style={{
                position: 'absolute',
                top: '50px',
                zIndex: 1000,
                border: '1px solid #ccc',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </Col>
        <Col span={6}>
          <Space>
            <Upload
              accept="image/*"
              multiple
              onChange={({ file, fileList }: any) => {
                console.log(file, 'file');
                console.log(fileList, 'fileList');
                setAttachments(fileList);
              }}
              showUploadList={false}
            >
              <Button icon={<FileImageOutlined />} />
            </Upload>
            <Button onClick={toggleEmojiPicker} icon={<SmileTwoTone />} />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => onSendComment()}
              loading={loading}
            />
          </Space>
        </Col>
      </Row>
      <div style={{ margin: 8 }}>
        {attachments?.length > 0 &&
          attachments?.map((file: any) => (
            <Image
              key={file.uid}
              src={URL.createObjectURL(file.originFileObj)}
              width={80}
              height={80}
            />
          ))}
      </div>
    </>
  );
};

export default CommentEditor;
