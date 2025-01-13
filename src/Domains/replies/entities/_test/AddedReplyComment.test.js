const AddedReplycomment = require('../AddedReplycomment');

describe('a AddedReplycomment entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply comment',
    };

    // Action and assert
    expect(() => new AddedReplycomment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'reply comment',
      user_id: 'user-123'
    };

    // Action and assert
    expect(() => new AddedReplycomment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return added reply comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply comment',
      user_id: 'user-123'
    };

    // Action
    const { id, content, owner } = new AddedReplycomment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.user_id);
  });
  
 });