class AddReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyPayload({ threadId, commentId, content, owner }) {
    if (!threadId || !commentId || !content || !owner) {
      throw new Error('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = AddReplyComment;
