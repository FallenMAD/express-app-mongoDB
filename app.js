import path from 'path';
import express from 'express';

import { rootDir } from './utils/dirnameHelper.js';
import { connectToDatabase } from './utils/database.js';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import { errorController } from './controllers/error.js';

import { User } from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findById(process.env.USER_ID)
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.handle404);

async function startServer() {
  await connectToDatabase();

  app.listen(3003, () => {
    console.log('Server started on port 3003');
  });
}

startServer();
