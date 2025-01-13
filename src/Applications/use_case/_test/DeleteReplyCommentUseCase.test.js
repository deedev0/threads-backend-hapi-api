const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const RepliesReposiory = require('../../../Domains/replies/RepliesRepository');

describe('DeleteReplyCommentUseCase', () => { 
  it('should orchestrating the soft delete comment action correctly', async () => {
    // Arrange
    const replyId = 'reply-123';
    const userId = 'user-123';

    // mocking
    const mockRepliesRepository = new RepliesReposiory();
    const mockDeleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      repliesRepository: mockRepliesRepository,
    });

    mockRepliesRepository.verifyReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.verifyReplyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.softDeleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    await mockDeleteReplyCommentUseCase.execute(replyId, userId);

    // Assert
    expect(mockRepliesRepository.verifyReplyComment).toHaveBeenCalledWith(replyId);
    expect(mockRepliesRepository.verifyReplyCommentOwner).toHaveBeenCalledWith(userId, replyId);
    expect(mockRepliesRepository.softDeleteReply).toHaveBeenCalledWith(replyId);
  });
 });
 