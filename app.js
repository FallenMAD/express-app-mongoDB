import path from 'path';
import express from 'express';

import { rootDir } from './utils/dirnameHelper.js';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import { errorController } from './controllers/error.js';
import { sequelize } from './utils/database.js';

import { Product } from './models/product.js';
import { User } from './models/user.js';
import { Cart } from './models/cart.js';
import { CartItem } from './models/cart-item.js';
import { Order } from './models/order.js';
import { OrderItem } from './models/order-item.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.handle404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      console.log('User not found');
      return User.create({ name: 'Roman', email: 'test@example.com' });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3003);
  })
  .catch((error) => {
    console.log(error);
  });
