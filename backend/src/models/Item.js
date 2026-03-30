const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  expirationDate: { type: Date },
  
  exactLocation: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Importante: en MongoDB siempre es [Longitud, Latitud]
      required: true
    }
  },
  
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'RESERVED', 'DELIVERED'], 
    default: 'AVAILABLE' 
  }
}, { timestamps: true });

// ÍNDICE 2DSPHERE
itemSchema.index({ exactLocation: '2dsphere' });

module.exports = mongoose.model('Item', itemSchema);