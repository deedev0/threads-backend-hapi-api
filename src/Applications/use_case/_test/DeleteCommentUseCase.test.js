const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => { 
  it('should orchestrating the soft delete comment action correctly', async () => {
    // arrange
    const commentId = 'comment-123';
    const user_id = 'user-123';

    // mocking
    const mockCommentRepository = new CommentRepository();
    const mockDeleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.softDeleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());


    // Action
    await mockDeleteCommentUseCase.execute(commentId, user_id);

    // Assert
    expect(mockCommentRepository.verifyComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(user_id, commentId);
    expect(mockCommentRepository.softDeleteComment).toHaveBeenCalledWith(commentId);
  });
 });
