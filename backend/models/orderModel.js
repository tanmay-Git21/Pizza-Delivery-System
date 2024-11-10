import mongoose from 'mongoose';

const PizzaDetailSchema = new mongoose.Schema({
  base: { type: String, required: true },
  sauce: { type: String, required: true },
  cheese: { type: String, required: true },
  veggies: [{ type: String }], // Array of selected veggies
  meat: [{ type: String }], // Array of selected meats, if applicable
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pizzaDetails: PizzaDetailSchema,
  status: { 
    type: String, 
    enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
    default: 'Order Received',
  },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', OrderSchema);
