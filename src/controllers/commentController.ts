import * as CommentService from '../services/commentService';
import type { RequestHandler } from 'express';
import type { UpdateCommentDto } from '../types/commentTypes';

// 댓글 수정
export const updateComment: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data: UpdateCommentDto = req.body;

  const updatedComment = await CommentService.updateComment(id, data);
  res.status(200).json(updatedComment);
};

// 댓글 삭제
export const deleteComment: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  await CommentService.deleteComment(id);
  res.sendStatus(204);
}; 