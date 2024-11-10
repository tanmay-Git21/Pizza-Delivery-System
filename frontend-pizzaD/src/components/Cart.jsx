import React from "react";

const Cart = ({ cart }) => {
  return (
    <div className="w-full h-full bg-[#FF9C73] p-3 flex flex-wrap gap-4 overflow-auto">
      <h2 className="w-full text-2xl mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in your cart yet!</p>
      ) : (
        cart.map((pizza, index) => (
          <div
            key={index}
            className="w-[18vw] h-[26vw] bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-[12vw] object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{pizza.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{pizza.description}</p>
              <p className="text-lg font-bold">${pizza.price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
