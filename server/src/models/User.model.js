const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    default: null // null for Google OAuth users
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null,
    sparse: true
  },
  disciplineScore: {
    type: Number,
    default: 0
  },
  chaosScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for mood calculation — based on NET score (discipline - chaos)
userSchema.virtual('mood').get(function() {
  const { disciplineScore, chaosScore } = this;
  const net = disciplineScore - chaosScore;

  if (net >= 15 && chaosScore < 5)  return 'heroic';
  if (net >= 6)                     return 'focused';
  if (net <= -10)                   return 'chaotic';
  if (net <= -3)                    return 'struggling';
  return 'neutral';
});

// Virtual for chaos-lock gate (net score <= -10 triggers game lockout)
userSchema.virtual('isChaosLocked').get(function() {
  return (this.disciplineScore - this.chaosScore) <= -10;
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) {
    return false; // Google users have no password
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to hash password
userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 10);
};

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
