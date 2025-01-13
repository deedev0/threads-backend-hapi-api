class DeleteReplyCommentUseCase {
  constructor({
    repliesRepository,
    authenticationTokenManager,
  }) {
    this._repliesRepository = repliesRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(replyId, user_id) {
    await this._repliesRepository.verifyReplyComment(replyId);
    await this._repliesRepository.verifyReplyCommentOwner(user_id, replyId);
    await this._repliesRepository.softDeleteReply(replyId);
  }
}

module.exports = DeleteReplyCommentUseCase;
