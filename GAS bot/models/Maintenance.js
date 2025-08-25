const qdb = require('../quick.db');

module.exports = {
  async findOne(query) {
    if (!query || !query.botID) return null;
    const v = qdb.fetch(`maintenance_${query.botID}`);
    return v || null;
  },

  async create(doc) {
    if (!doc || !doc.botID) throw new Error('botID required');
    const entry = {
      botID: doc.botID,
      authorID: doc.authorID || null,
      timestamp: doc.timestamp || Date.now(),
    };
    qdb.set(`maintenance_${doc.botID}`, entry);
    return entry;
  },

  async deleteOne(query) {
    if (!query || !query.botID) return { deletedCount: 0 };
    qdb.del(`maintenance_${query.botID}`);
    return { deletedCount: 1 };
  },
};
