const NewAuth = require('../NewAuth');

describe('NewAuth', () => {
  it('should return error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'abc',
    };

    // Action and Arrange
    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      accessToken: 'abc',
      refreshToken: ['abc'],
    };

    // Action and Arrange
    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewAuth entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'abc',
      refreshToken: 'efg',
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  })
});
