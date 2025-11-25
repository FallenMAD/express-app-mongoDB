import { Product } from '../models/product.js';
import { Cart } from '../models/cart.js';

export const shopController = {
  getIndex(req, res, next) {
    Product.findAll()
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
    Product.findAll()
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
    Product.findByPk(id)
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
      .then((cart) => {
        return cart
          .getProducts()
          .then((products) => {
            res.render('shop/cart', {
              docTitle: 'Cart',
              path: req.originalUrl,
              products,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },

  postCart(req, res, next) {
    const { id } = req.body;
    let fetchedCart;
    let newQuantity = 1;

    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id } });
      })
      .then((products) => {
        let product;
        if (!!products.length) {
          product = products[0];
        }

        if (product) {
          const oldQuantity = product.CartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(id);
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  },

  deleteCartProduct(req, res, next) {
    const { id } = req.params;
    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts({ where: { id } });
      })
      .then((products) => {
        const product = products[0];
        return product.CartItem.destroy();
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  },

  postOrder(req, res, next) {
    let fetchedCart;
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then((products) => {
        return req.user
          .createOrder()
          .then((order) => {
            return order.addProducts(
              products.map((product) => {
                product.orderItem = { quantity: product.CartItem.quantity };
                return product;
              })
            );
          })
          .catch((err) => console.log(err));
      })
      .then((result) => {
        return fetchedCart.setProducts(null);
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => console.log(err));
  },

  getOrders(req, res, next) {
    req.user
      .getOrders({ include: ['Products'] })
      .then((orders) => {
        res.render('shop/orders', {
          docTitle: 'Orders',
          path: req.originalUrl,
          orders,
        });
      })
      .catch((err) => console.log(err));
  },
};
