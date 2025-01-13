const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUserUseCase {
  constructor({ threadsRepository }) {
    this._threadsRepository = threadsRepository;
  }

  async execute(payload, user_id) {
    payload.id = user_id;
    const addThread = new AddThread(payload);
    return this._threadsRepository.addThread(addThread);
  }
}

module.exports = ThreadUserUseCase;
