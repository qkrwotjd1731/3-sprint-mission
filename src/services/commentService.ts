import { UpdateCommentDto, CommentResponseDto } from '../types/commentTypes';
import * as commentRepository from '../repositories/commentRepository';

export const updateComment = (id: number, data: UpdateCommentDto): Promise<CommentResponseDto> =>
  commentRepository.update(id, data);

export const deleteComment = (id: number): Promise<CommentResponseDto> =>
  commentRepository.remove(id);