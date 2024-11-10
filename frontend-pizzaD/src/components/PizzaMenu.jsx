import React from "react";
import PizzaCard from "./PizzaCard"; // Reusable Pizza Card component

const PizzaMenu = ({ pizzas, addToCart }) => {
  return (
    <div className="w-full h-full bg-[#FF9C73] p-3 flex flex-wrap gap-4 overflow-auto">
      {pizzas.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default PizzaMenu;
