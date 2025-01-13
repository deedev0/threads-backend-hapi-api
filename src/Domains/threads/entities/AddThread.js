class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload({ title, body, id }) {
    if (!title || !body || !id) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof id !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = AddThread;
