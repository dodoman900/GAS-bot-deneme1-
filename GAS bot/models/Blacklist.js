const qdb = require('../quick.db');

module.exports = {
  async findOne(query) {
    if (!query || !query.userId) return null;
    const v = qdb.fetch(`blacklist_${query.userId}`);
    return v || null;
  },

  async create(doc) {
    if (!doc || !doc.userId) throw new Error('userId required');
    const entry = {
      userId: doc.userId,
      reason: doc.reason || null,
      createdAt: Date.now(),
    };
    qdb.set(`blacklist_${doc.userId}`, entry);
    return entry;
  },

  async deleteOne(query) {
    if (!query || !query.userId) return { deletedCount: 0 };
    qdb.del(`blacklist_${query.userId}`);
    return { deletedCount: 1 };
  },
};
