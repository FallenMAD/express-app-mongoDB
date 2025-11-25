import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});
