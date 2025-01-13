class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, user_id) {
    await this._commentRepository.verifyComment(commentId);
    await this._commentRepository.verifyCommentOwner(user_id, commentId);
    await this._commentRepository.softDeleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
