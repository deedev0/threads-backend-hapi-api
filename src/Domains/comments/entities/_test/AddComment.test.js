const AddComment = require('../AddComment');

describe('a AddComment entities', () => { 
  it('should throw error when payload did not contain property', () => {
    // Arrange 
    const payload = {
      threadId: 'thread-123',
      content: 'comment thread',
    };

    // Action and Expect
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange 
    const payload = {
      threadId: 'thread-123',
      content: ['comment thread'],
      owner: 'user-123'
    };

    // Action and Expect
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create object comment correctly', () => {
    // Arrange 
    const payload = {
      threadId: 'thread-123',
      content: 'comment thread',
      owner: 'user-123'
    };

    // Action
    const { threadId, content, owner } = new AddComment(payload);

    // Action and Expect
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
 });
