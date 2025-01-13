const AddReplyComment = require('../../Domains/replies/entities/AddReplyComment');

class AddReplyUseCase {
  constructor({
    threadsRepository,
    commentRepository,
    repliesCommentRepository,
    authenticationTokenManager,
  }) {
      this._threadsRepository = threadsRepository;
      this._commentRepository = commentRepository;
      this._repliesCommentRepository = repliesCommentRepository;
      this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload, threadId, commentId, user_id) {
    await this._threadsRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);

    payload = { ...payload, owner: user_id, threadId: threadId, commentId: commentId };
    const addReply = new AddReplyComment(payload);
    return await this._repliesCommentRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
