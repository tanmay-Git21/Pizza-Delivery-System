import React from "react";

const PizzaCard = ({ pizza, addToCart }) => {
  return (
    <div className="w-[18vw] h-[26vw] bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={pizza.image}
        alt={pizza.name}
        className="w-full h-[12vw] object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{pizza.name}</h2>
        <p className="text-gray-600 text-sm mb-2">{pizza.description}</p>
        <p className="text-lg font-bold">${pizza.price}</p>
        {/* Add to Cart button */}
        <button
          onClick={() => addToCart(pizza)}
          className="mt-4 w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
