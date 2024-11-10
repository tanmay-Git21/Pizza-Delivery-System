import mongoose from 'mongoose';

const PizzaOptionsSchema = new mongoose.Schema({
  baseOptions: [{ type: String, required: true }],  // e.g., ["Thin Crust", "Thick Crust", "Stuffed Crust"]
  sauceOptions: [{ type: String, required: true }], // e.g., ["Tomato", "Pesto", "BBQ"]
  cheeseOptions: [{ type: String, required: true }], // e.g., ["Mozzarella", "Cheddar", "Parmesan"]
  veggieOptions: [{ type: String, required: true }], // e.g., ["Bell Pepper", "Olives", "Mushrooms"]
  meatOptions: [{ type: String, required: true }],  // e.g., ["Pepperoni", "Sausage", "Chicken"]
});

export default mongoose.model('PizzaOptions', PizzaOptionsSchema);
