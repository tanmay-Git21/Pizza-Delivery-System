import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import UserDashboard from "./Pages/Dashboard/UserDashboard";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword></ForgotPassword>,
  },
  {
    path: "/dashboard",
    element: <UserDashboard></UserDashboard>,
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
};

export default App;
