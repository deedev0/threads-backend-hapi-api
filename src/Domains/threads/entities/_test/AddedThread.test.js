const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => { 
  it('should throw when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Sebuah Thread',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Sebuah Thread',
      user_id: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.user_id);
  });
 });
