import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch user data
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setFavorites(res.data.favourites || []);
      setCart(res.data.cart || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="border p-4 rounded space-y-2">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
      </div>

      {/* Favorites */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Favorites</h2>
        {favorites.length === 0 && <p>No favorite products</p>}
        <ul className="space-y-1">
          {favorites.map((prod) => (
            <li key={prod._id}>
              <Link to={`/products/${prod._id}`} className="text-indigo-600">
                {prod.name} - ₹{prod.price}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Cart */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Cart</h2>
        {cart.length === 0 && <p>Cart is empty</p>}
        <ul className="space-y-1">
          {cart.map((item) => (
            <li key={item.productId._id}>
              <Link
                to={`/products/${item.productId._id}`}
                className="text-indigo-600"
              >
                {item.productId.name} x {item.quantity} - ₹
                {item.productId.price * item.quantity}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Orders */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        {orders.length === 0 && <p>No orders placed</p>}
        <ul className="space-y-1">
          {orders.map((order) => (
            <li key={order._id}>
              <Link
                to={`/orders/${order._id}`}
                className="text-indigo-600"
              >
                Order #{order._id} - ₹{order.totalPrice} - {order.status}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
