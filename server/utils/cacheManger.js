class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  // Setting a value in cache
  set(key, value) {
    this.cache.set(key, value);
  }

  // Getting a value from cache
  get(key) {
    return this.cache.get(key);
  }

  // Checking if a key exists in cache
  has(key) {
    return this.cache.has(key);
  }

  // Loading multiple items into cache
  loadBulk(data) {
    for (const [key, value] of Object.entries(data)) {
      this.set(key, value);
    }
  }
}

module.exports = CacheManager;
