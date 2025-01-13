class GetThreadUseCase {
  constructor({
    threadsRepository,
    commentsRepository,
    repliesRepository,
    usersRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._commentsRepository = commentsRepository;
    this._repliesRepository = repliesRepository;
    this._usersRepository = usersRepository;
  }

  async execute(threadId) {
    // Verifikasi Thread
    await this._threadsRepository.verifyThread(threadId);
    // Ambil data thread dari ThreadsRepository
    const thread = await this._threadsRepository.getThreadById(threadId);

    // Ambil username owner dari UsersRepository
    const owner = await this._usersRepository.getUsernameById(thread.user_id);

    // Ambil comments berdasarkan thread ID
    const comments = await this._commentsRepository.getCommentsByThreadId(threadId);

    // Gabungkan komentar dengan balasannya
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._repliesRepository.getRepliesByCommentId(comment.id);
        return {
          id: comment.id,
          username: await this._usersRepository.getUsernameById(comment.user_id),
          date: comment.date,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          replies: await Promise.all(
            replies.map(async (reply) => ({
              id: reply.id,
              username: await this._usersRepository.getUsernameById(reply.user_id),
              date: reply.date,
              content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
            }))
          ),
        };
      })
    );

    // Susun data akhir sesuai format
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: owner, // Username dari UsersRepository
      comments: commentsWithReplies,
    };
  }
}

module.exports = GetThreadUseCase;
