const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => { 
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // mocking
    const mockCommentRepository = new CommentRepository();
    const mockThreadsRepository = new ThreadsRepository();
    const mockAddCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadsRepository: mockThreadsRepository,
    });

    mockThreadsRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({ ...payload, user_id: payload.owner, id: payload.threadId})));


    // Action
    const comment = await mockAddCommentUseCase.execute(payload, payload.threadId, payload.owner);

    // Assert
    expect(mockThreadsRepository.verifyThread).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(payload);
    expect(comment).toBeDefined();
    expect(comment.id).toStrictEqual(payload.threadId);
    expect(comment.content).toStrictEqual(payload.content);
    expect(comment.owner).toStrictEqual(payload.owner);
 });
  
});