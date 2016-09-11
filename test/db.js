import Datastore from 'nedb';
import promiseify from 'just-promiseify';

const db = new Datastore({
	filename: './posts/posts.json',
	autoload: true
});

export default class Database {
  static find() {
    return promiseify(db.find).apply(db, arguments);
  }

  static update() {
    return promiseify(db.update).apply(db, arguments);
  }
}
