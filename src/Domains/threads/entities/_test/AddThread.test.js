const AddThread = require('../AddThread');

describe('a AddThread entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'Sebuah Thread',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 123,
      body: 'Ini adalah body thread',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create thread object correctly', async () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'Sebuah Thread',
      body: 'Ini adalah body thread',
    };

    // Action
    const { id, title, body } = new AddThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  })
 });
