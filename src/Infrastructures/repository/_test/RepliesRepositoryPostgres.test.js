const UserTableTestHelper = require('../../../../test/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../test/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const AddReplyComment = require('../../../Domains/replies/entities/AddReplyComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedReplycomment = require('../../../Domains/replies/entities/AddedReplycomment');


describe('RepliesRepositoryPostgres', () => { 
  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UserTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await ThreadsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => { 
    it('should persist add reply comment', async () => {
      // Arrange
      const addReply = new AddReplyComment({
        content: 'reply comment',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await repliesRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await ThreadsTableTestHelper.findReplyComment('reply-123');
      expect(reply).toHaveLength(1);
      expect(reply[0].id).toStrictEqual('reply-123');
      expect(reply[0].content).toStrictEqual(addReply.content);
      expect(reply[0].user_id).toStrictEqual(addReply.owner);

      expect(addedReply).toStrictEqual(new AddedReplycomment({
        id: 'reply-123',
        content: addReply.content,
        user_id: addReply.owner,
      }));
    });
   });

   describe('verifyReplyComment function', () => { 
    it('should throw NotFoundError when reply id not found', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyComment('reply-123')).rejects.toThrow(NotFoundError);
    });  

    it('should not throw NotFoundError when reply id found', async () => {
      // Arrange
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addReplyComment({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyComment('reply-123')).resolves.not.toThrow(NotFoundError);
    });  
  });

   describe('verifyReplyCommentOwner function', () => { 
    it('should throw AuthorizationError when owner not have author', async () => {
      // Arrange
      await ThreadsTableTestHelper.addReplyComment({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyCommentOwner('user-234', 'reply-123')).rejects.toThrow(AuthorizationError);
    });  

    it('should not throw Authorization when owner had author', async () => {
      // Arrange
      await ThreadsTableTestHelper.addReplyComment({})
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyCommentOwner('user-123', 'reply-123')).resolves.not.toThrow(AuthorizationError);
    });  
  });

  describe('softDeleteReply', () => { 
    it('should soft delete reply comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addReplyComment({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(repliesRepositoryPostgres.softDeleteReply('reply-123')).resolves.not.toThrow();
      await expect((await ThreadsTableTestHelper.findReplyComment('reply-123'))[0].is_delete).toBeTruthy();
    });
   });

   describe('getRepliesByCommentId function', () => { 
    it('should return replies comment by comment id', async () => {
      // Arrange
      await ThreadsTableTestHelper.addReplyComment({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action
      const replies = await repliesRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      await expect(replies).toHaveLength(1);
      await expect(replies).toStrictEqual(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            user_id: 'user-123',
            content: 'Reply Comment',
            date: '2021-08-08T07:19:09.775Z',
            is_delete: false
          },
        ],
      );
    })
    })
 });
