import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});
