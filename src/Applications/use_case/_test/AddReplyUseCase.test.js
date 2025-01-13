const AddReplyUseCase = require('../AddReplyUseCase');
const AddReplyComment = require('../../../Domains/replies/entities/AddReplyComment');
const AddedReplyComment = require('../../../Domains/replies/entities/AddedReplycomment');
const RepliesCommentRepository = require('../../../Domains/replies/RepliesRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');

describe('AddReplyUseCase', () => { 
  it('should orchestrating the add reply comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'reply comment',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // mocking
    const mockThreadsRepository = new ThreadsRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesCommentRepository = new RepliesCommentRepository();
    const mockAddReplyUseCase = new AddReplyUseCase({
      threadsRepository: mockThreadsRepository,
      commentRepository: mockCommentRepository,
      repliesCommentRepository: mockRepliesCommentRepository,
    });
    const addReply = new AddReplyComment(payload);

    mockThreadsRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyComment = jest.fn()    
      .mockImplementation(() => Promise.resolve());

    mockRepliesCommentRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReplyComment({ ...addReply, id: 'reply-123', user_id: addReply.owner })));


    // Action
    const reply = await mockAddReplyUseCase.execute(payload, payload.threadId, payload.commentId, payload.owner);

    // Assert
    expect(mockThreadsRepository.verifyThread).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyComment).toHaveBeenCalledWith(payload.commentId);
    expect(mockRepliesCommentRepository.addReply).toHaveBeenCalledWith(payload);

    expect(reply.id).toStrictEqual('reply-123');
    expect(reply.content).toStrictEqual(payload.content);
    expect(reply.owner).toStrictEqual(payload.owner);
  });
 });
 