const mongoose = require('mongoose');
const ROLES = ['user', 'admin', 'moderator']
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Role = mongoose.model('Role', roleSchema);
module.exports = { Role, ROLES}
