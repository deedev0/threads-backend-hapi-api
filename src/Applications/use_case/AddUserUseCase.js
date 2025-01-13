const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload); // fungsinya veifypayload doang lalu return payload
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password); // mengganti password pada class register user lalu menghashnya
    return this._userRepository.addUser(registerUser); // menyimpan data ke database dan mengembalikan return id, username, fullname
  }
}

module.exports = AddUserUseCase;

