import mongoDB from 'mongodb';
import { getDb } from '../utils/database.js';

export class Product {
  constructor(title, price, description, imageURL, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = id;
  }

  save() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: new mongoDB.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db
        .collection('products')
        .insertOne(this)
    }
    return dbOp
      .then(record => {
        console.log(record)
      })
      .catch(err => {
        console.log(err)
      })
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        // console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err)
      });
  }

  static findOne(id) {
    const db = getDb();
    return db.collection('products')
      .findOne({ _id: new mongoDB.ObjectId(id) })
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err)
      })
  }
}
