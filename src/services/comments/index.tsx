import { request } from '@umijs/max';

interface IComment {
  task_id: string;
  parent_id?: string;
  user_id: string;
  content: string;
  reactions: {
    user_id: string;
    type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry' | 'sad';
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const createComment = async (params: any) => {
  return await request('/api/v1/comment/create', {
    method: 'POST',
    data: params,
  });
};

export const reactionComment = async (taskId: string, data: any) => {
  return await request(`/api/v1/comment/reaction/${taskId}`, {
    method: 'POST',
    data: data,
  });
};

export const replyComment = async (commentId: string, data: any) => {
  return await request(`/api/v1/comment/reply/${commentId}`, {
    method: 'POST',
    data: data,
  });
};
