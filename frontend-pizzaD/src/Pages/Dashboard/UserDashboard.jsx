import React, { useState } from "react";
import margerita from "../Dashboard/margerita.jpg";
import hawaii from "../Dashboard/hawaii.jpg";
import bbq from "../Dashboard/BBq chicken.jpg";
import meat from "../Dashboard/meat-lovers.jpg";
import pepper from "../Dashboard/pepperoni.jpg";
import spicy from "../Dashboard/spicy.jpg";
import cheese from "../Dashboard/cheese.jpg";
import mushroom from "../Dashboard/mushroom.jpg";
import buffalo from "../Dashboard/buffalo.jpg";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserDashboard = () => {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu"); // State to control which view to show
  const navigate = useNavigate(); // Initialize navigate

  // Function to add pizza to cart
  const addToCart = (pizza) => {
    setCart((prevCart) => [...prevCart, pizza]);
    alert(`${pizza.name} added to your cart!`);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to the login page
  };

  // Pizzas data
  const pizzas = [
    {
      id: 1,
      name: "Margherita",
      image: margerita,
      price: 12.99,
      description: "Classic pizza with tomato, mozzarella, and fresh basil.",
    },
    {
      id: 2,
      name: "Pepperoni",
      image: pepper,
      price: 14.99,
      description: "Topped with pepperoni and mozzarella cheese.",
    },
    {
      id: 3,
      name: "BBQ Chicken",
      image: bbq,
      price: 15.99,
      description: "Grilled chicken, BBQ sauce, red onions, and cilantro.",
    },
    {
      id: 5,
      name: "Hawaiian",
      image: hawaii,
      price: 14.99,
      description: "Ham, pineapple, mozzarella, and tomato sauce.",
    },
    {
      id: 6,
      name: "Meat Lovers",
      image: meat,
      price: 16.99,
      description: "Pepperoni, sausage, ham, bacon, and mozzarella.",
    },
    {
      id: 7,
      name: "Four Cheese",
      image: cheese,
      price: 14.49,
      description: "Mozzarella, cheddar, gouda, and blue cheese.",
    },
    {
      id: 8,
      name: "Buffalo Chicken",
      image: buffalo,
      price: 15.99,
      description: "Spicy buffalo sauce, grilled chicken, and blue cheese.",
    },
    {
      id: 9,
      name: "Mushroom and Truffle Oil",
      image: mushroom,
      price: 16.49,
      description: "Mushrooms, truffle oil, mozzarella, and parmesan.",
    },
    {
      id: 10,
      name: "Spicy Jalapeño",
      image: spicy,
      price: 13.99,
      description: "Jalapeños, pepperoni, and spicy marinara sauce.",
    },
  ];

  // Handle changing views
  const handleViewChange = (viewName) => {
    setView(viewName); // Set view based on the clicked button
  };

  // Render Cart
  const renderCart = () => {
    return (
      <div className="w-full h-full bg-[#FF9C73] p-3 flex flex-wrap gap-4 overflow-auto">
        <h2 className="w-full text-2xl mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>No items in your cart yet!</p>
        ) : (
          cart.map((pizza, index) => (
            <div key={index} className="w-[18vw] h-[26vw] bg-white shadow-lg rounded-lg overflow-hidden">
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

  // Render Pizza Menu
  const renderPizzaMenu = () => {
    return (
      <div className="w-full h-full bg-[#FF9C73] p-3 flex flex-wrap gap-4 overflow-auto">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="w-[18vw] h-[26vw] bg-white shadow-lg rounded-lg overflow-hidden">
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
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen font-semibold bg-[#FCF596] flex flex-col">
      {/* Header */}
      <div className="w-full h-[4vw] bg-[#FBD288] flex items-center p-3">
        <div className="w-1/2 h-full flex items-center text-2xl">Pizza Mania</div>
        <div className="w-1/2 h-full flex items-center justify-end gap-3">
          <button
            onClick={handleLogout} // Attach logout function
            className="text-white p-2 bg-[#FF4545] rounded-md hover:bg-[#f92626]  transition-all ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full bg-green-400 flex">
        {/* Sidebar */}
        <div className="w-[20%] h-full bg-[#FF4545] p-3 flex flex-col gap-2">
          <button
            onClick={() => handleViewChange("cart")}
            className="w-full h-10 bg-gray-100 hover:bg-gray-300 transition-all ease-in-out rounded-md"
          >
            Your Cart
          </button>
          <button
            onClick={() => handleViewChange("menu")}
            className="w-full h-10 bg-gray-100 hover:bg-gray-300 transition-all ease-in-out rounded-md"
          >
            Make your custom pizza
          </button>
        </div>

        {/* Main Content */}
        <div className="w-[80%] h-full bg-[#FF9C73] p-3">
          {view === "cart" ? renderCart() : renderPizzaMenu()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
