import mongoose from 'mongoose';

const InventoryItemSchema = new mongoose.Schema({
  itemType: { type: String, required: true }, // e.g., "base", "sauce", "cheese", "veggie", "meat"
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  threshold: { type: Number, required: true }, // Low stock alert threshold
});

const InventorySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [InventoryItemSchema],
});

export default mongoose.model('Inventory', InventorySchema);
