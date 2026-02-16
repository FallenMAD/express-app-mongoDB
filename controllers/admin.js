import { Product } from '../models/product.js';
import mongoDB from 'mongodb';

export const adminController = {
  getProducts(req, res, next) {
    Product.fetchAll()
      .then((result) => {
        res.render('admin/list-product', {
          products: result,
          docTitle: 'Admin Products',
          path: req.originalUrl,
        });
      })
      .catch((err) => console.log(err));
  },

  getAddProduct(req, res, next) {
    res.render('admin/edit-product', {
      docTitle: 'Add Product',
      path: req.originalUrl,
      editing: false,
    });
  },

  postAddProduct(req, res, next) {
    const { title, imageURL, price, description } = req.body;
    const product = new Product(
      title,
      price,
      description,
      imageURL,
      null,
      req.user._id
    );
    product
      .save()
      .then((result) => {
        res.redirect('/admin/list-product');
      })
      .catch((err) => {
        console.log(err);
      });
  },

  deleteProduct(req, res, next) {
    const { id } = req.params;
    Product.deleteOne(id)
      .then(() => {
        return req.user.deleteItemFromCart(id);
      })
      .then(() => {
        console.log('PRODUCT IS DELETED');
        res.redirect('/admin/list-product');
      })
      .catch((err) => console.log(err));
  },

  getEditProduct(req, res, next) {
    const isEditMode = req.query.edit;
    if (!isEditMode) {
      return res.redirect('/');
    }

    const { id } = req.params;

    Product.findOne(id)
      .then((product) => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          docTitle: 'Editing Product',
          path: req.originalUrl,
          product: product,
          editing: isEditMode,
        });
      })
      .catch((err) => console.log(err));
  },

  postEditProduct(req, res, next) {
    const { id, title, imageURL, price, description } = req.body;
    const product = new Product(title, price, description, imageURL, id);

    product
      .save()
      .then((result) => {
        console.log('PRODUCT IS UPDATED');
        res.redirect('/admin/list-product');
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
