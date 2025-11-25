import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});
