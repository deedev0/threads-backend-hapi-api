const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RepliesRepository = require('../../Domains/replies/RepliesRepository');
const AddedComment = require('../../Domains/replies/entities/AddedReplycomment');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { owner, commentId, content } = payload;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_reply_comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, commentId, owner, content, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyReplyComment(id) {
    const query = {
      text: 'SELECT * FROM thread_reply_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('reply comment id tidak ditemukan.');
    }
  }

  async verifyReplyCommentOwner(owner, replyId) {
    const query = {
      text: 'SELECT * FROM thread_reply_comments WHERE id = $1 AND user_id = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('user tidak berhak menghapus reply comment.');
    }
  }

  async softDeleteReply(id) {
    const query = {
      text: `UPDATE thread_reply_comments
      SET is_delete = true
      WHERE id = $1
      `,
      values: [id],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM thread_reply_comments WHERE comment_id = $1 ORDER BY date asc',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = RepliesRepositoryPostgres;
