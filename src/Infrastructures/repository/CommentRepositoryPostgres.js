const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { owner, threadId, content } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, threadId, owner, content, date],
    };


    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });

  }

  async verifyComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('comment id tidak ditemukan.');
    }
  }

  async verifyCommentOwner(owner, commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND user_id = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('user tidak berhak menghapus comment.');
    }
  }

  async softDeleteComment(commentId) {
    const query = {
      text: `UPDATE thread_comments 
      SET is_delete = true
      WHERE id = $1`,
      values: [commentId],
    };

    await this._pool.query(query)
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
