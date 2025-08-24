// quick.db shim: proje içindeki require('quick.db') çağrılarını karşılamak için.
// Bu dosya node-persist kullanır ve quick.db benzeri API (fetch/set/delete/push) sağlar.

const storage = require('node-persist'); // hafif, saf-js yerel disk depolama
storage.initSync({ dir: 'data_storage', forgiveParseErrors: true }); // senkron init (basit projeler için)

// fetch anahtarını geri döndürür (quick.db uyumlu isim: fetch)
function fetch(key) {
  return storage.getItemSync(key);
}

// set anahtarına değer atar (quick.db uyumlu isim: set)
function set(key, value) {
  return storage.setItemSync(key, value);
}

// delete anahtarı siler (quick.db uyumlu isim: delete)
function del(key) {
  return storage.removeItemSync(key);
}

// push: diziye öğe ekler (quick.db.push benzeri)
function push(key, value) {
  let arr = storage.getItemSync(key);
  if (!Array.isArray(arr)) arr = [];
  arr.push(value);
  storage.setItemSync(key, arr);
  return arr;
}

// all: tüm depolamayı objeye çevirir (basit)
function all() {
  // node-persist'te tüm anahtarları almak hem senkron hem de kolay
  const keys = storage.keys();
  const out = {};
  for (const k of keys) {
    out[k] = storage.getItemSync(k);
  }
  return out;
}

// Kullanışlı alias'lar (quick.db kodlarında kullanılan isimler)
module.exports = {
  fetch,         // quick.db.fetch(key)
  set,           // quick.db.set(key, value)
  delete: del,   // quick.db.delete(key)
  del,           // quick.db.del(key)
  push,          // quick.db.push(key, value)
  all,           // quick.db.all()
  // backward compat: bazı kodlar require('quick.db')() şeklinde kullanabilir
  // return self when invoked as function
  __esModule: true
};
