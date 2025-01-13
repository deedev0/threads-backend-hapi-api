const UserLogin = require('../UserLogin');

describe('UserLogin', () => {
  it('should return error when not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding'
    };

    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_CONTAINT_NEEDED_PROPERTY');
  });
  it('should return error when not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 123,
    };

    expect(() => new UserLogin(payload)).toThrow('USER_LOGIN.NOT_MEET_DATA_SPECIFICATION');
  });
  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: '12345',
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
