const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadsRepository }) {
    this._commentRepository = commentRepository;
    this._threadsRepository = threadsRepository;
  }

  async execute(payload, threadId, user_id) {
    await this._threadsRepository.verifyThread(threadId);
    payload = { ...payload, owner: user_id, threadId: threadId};
    const addComment = new AddComment(payload);
    return await this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
