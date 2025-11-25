import { Product } from '../models/product.js';

export const adminController = {
  getProducts(req, res, next) {
    req.user
      .getProducts()
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
    console.log(req.body);
    req.user
      .createProduct({
        title,
        price,
        imageURL,
        description,
      })
      .then((result) => {
        res.redirect('/admin/list-product');
      })
      .catch((error) => {
        console.log(error);
      });
  },

  deleteProduct(req, res, next) {
    const { id } = req.params;
    Product.destroy({ where: { id } })
      .then(() => {
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
    req.user
      .getProducts({ where: { id } })
      // Product.findByPk(id)
      .then((result) => {
        const product = result[0];
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          docTitle: 'Editing Product',
          path: req.originalUrl,
          product: result[0],
          editing: isEditMode,
        });
      })
      .catch((err) => console.log(err));
  },

  postEditProduct(req, res, next) {
    const { id, title, imageURL, price, description } = req.body;

    Product.findByPk(id)
      .then((product) => {
        product.title = title;
        product.imageURL = imageURL;
        product.price = price;
        product.description = description;

        return product.save();
      })
      .then((result) => {
        res.redirect('/admin/list-product');
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
