import * as commentRepository from '../repositories/commentRepository';
import type { Comment, UpdateCommentDTO } from '../types/commentTypes';

export const updateComment = async (id: number, data: UpdateCommentDTO): Promise<Comment> => {
  return await commentRepository.update(id, data);
};

export const deleteComment = async (id: number): Promise<void> => {
  await commentRepository.remove(id);
};
