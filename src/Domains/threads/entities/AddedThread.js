class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, user_id: owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload({ id, title, user_id }) {
    if (!id || !title || !user_id) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof user_id !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}
``
module.exports = AddedThread;
