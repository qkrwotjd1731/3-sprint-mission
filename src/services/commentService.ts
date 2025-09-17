import type { UpdateCommentDto, CommentResponseDto } from '../types/commentTypes';
import * as commentRepository from '../repositories/commentRepository';

export const updateComment = async (
  id: number,
  data: UpdateCommentDto,
): Promise<CommentResponseDto> => {
  return await commentRepository.update(id, data);
};

export const deleteComment = async (id: number): Promise<void> => {
  await commentRepository.remove(id);
};
