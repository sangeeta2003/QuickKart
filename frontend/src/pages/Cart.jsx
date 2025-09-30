import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await api.get("/users/me");
      setCart(res.data.cart || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put(`/cart/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const orderData = {
        products: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      };
      const res = await api.post("/orders/add", orderData);
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/products" className="text-indigo-600">Shop now</Link></p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.productId._id} className="flex justify-between items-center border p-4 rounded">
                <div>
                  <Link to={`/products/${item.productId._id}`} className="text-lg font-semibold text-indigo-600">
                    {item.productId.name}
                  </Link>
                  <p>₹{item.productId.price} x {item.quantity}</p>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                    className="border rounded p-1 w-16"
                  />
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-bold">Total: ₹{totalPrice}</div>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
