const AddReplyComment = require('../AddReplyComment');

describe('a AddReplyComment entities', () => { 
  it('should throw error when payload did not contain property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'reply comment thread',
    };

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: ['comment-123'],
      owner: 'user-123',
      content: 'reply comment thread',
    };

    // Action and Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create object reply comment correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'reply comment thread',
    };

    // Action
    const { threadId, commentId, content, owner } = new AddReplyComment(payload);

    // Action and Expect
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
 });
