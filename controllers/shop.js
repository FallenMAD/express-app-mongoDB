import { Product } from '../models/product.js';

export const shopController = {
  getIndex(req, res, next) {
    Product.fetchAll()
      .then((result) => {
        res.render('shop/product-list', {
          products: result,
          docTitle: 'Product list',
          path: req.originalUrl,
        });
      })
      .catch((err) => console.log(err));
  },

  getProducts(req, res, next) {
    Product.fetchAll()
      .then((result) => {
        res.render('shop/index', {
          docTitle: 'Shop',
          path: req.originalUrl,
          products: result,
        });
      })
      .catch((err) => console.log(err));
  },

  getProductDetails(req, res, next) {
    const { id } = req.params;
    Product.findOne(id)
      .then((result) => {
        res.render('shop/product-details', {
          docTitle: 'Details Product Page',
          path: '/products',
          product: result,
        });
      })
      .catch((err) => console.log(err));
  },

  getCart(req, res, next) {
    req.user
      .getCart()
      .then((products) => {
        res.render('shop/cart', {
          docTitle: 'Cart',
          path: req.originalUrl,
          products,
        });
      })
      .catch((err) => console.log(err));
  },

  postCart(req, res, next) {
    const { id } = req.body;
    Product.findOne(id)
      .then((product) => {
        req.user.addToCart(product);
        return product;
      })
      .then((result) => {
        console.log('product is added', result);
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  },

  deleteCartProduct(req, res, next) {
    const { id } = req.params;
    req.user
      .deleteItemFromCart(id)
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  },

  postOrder(req, res, next) {
    req.user
      .addOrder()
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => console.log(err));
  },

  getOrders(req, res, next) {
    req.user
      .getOrders()
      .then((orders) => {
        console.log(orders);
        res.render('shop/orders', {
          docTitle: 'Orders',
          path: req.originalUrl,
          orders,
        });
      })
      .catch((err) => console.log(err));
  },
};
