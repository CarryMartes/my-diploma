class Storage {
  constructor() {
    this._store = window.localStorage;
  }

  get(value) {
    return this._store.getItem(value);
  }

  remove(key) {
    return this._store.removeItem(key);
  }

  set(key, value) {
    return this._store.setItem(key, value);
  }
}

const store = new Storage();

export default store;
