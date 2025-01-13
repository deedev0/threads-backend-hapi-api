/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', user_id = 'user-123', title = 'Sebuah Thread', body = 'Ini adalah body thread', date = '2021-08-08T07:19:09.775Z'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, user_id, title, body, date],
    };

    await pool.query(query);
  },

  async findThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addComment({
    id = 'comment-123', thread_id = 'thread-123', user_id = 'user-123', content = 'Comment', date = '2021-08-08T07:19:09.775Z', is_delete = false
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, thread_id, user_id, content, date, is_delete],
    };

    await pool.query(query);
  },

  async findComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addReplyComment({
    id = 'reply-123', comment_id = 'comment-123', user_id = 'user-123', content = 'Reply Comment', date = '2021-08-08T07:19:09.775Z', is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO thread_reply_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, comment_id, user_id, content, date, is_delete],
    };

    await pool.query(query);
  },

  async findReplyComment(id) {
    const query = {
      text: 'SELECT * FROM thread_reply_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async softDeleteReplyComment(id) {
    const query = {
      text: 'UPDATE thread_reply_comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

module.exports = ThreadsTableTestHelper;
