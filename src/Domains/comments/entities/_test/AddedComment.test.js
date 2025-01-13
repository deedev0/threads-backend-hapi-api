const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: ['comment'],
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return added comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'comment',
      user_id: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.user_id);
  });
});
