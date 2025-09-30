import React, { useState, useEffect } from "react";
import api from "../api/axios";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user cart
  const fetchCart = async () => {
    try {
      const res = await api.get("/users/cart");
      setCart(res.data.cart || []);
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

  const handlePayment = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    try {
      // Create order in backend
      const orderRes = await api.post("/orders/add", {
        products: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      });

      const order = orderRes.data.order;

      // Create Razorpay order
      const paymentRes = await api.post("/payments/create-payment", {
        amount: order.totalPrice,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // front-end key
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        order_id: paymentRes.data.id,
        name: "QuickKart",
        description: "Order Payment",
        handler: async function (response) {
          alert("Payment Successful!");
          // TODO: update payment status in backend
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }

    setLoading(false);
  };

  if (cart.length === 0)
    return <div className="p-4">Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="border rounded p-4 bg-white shadow-sm flex justify-between"
          >
            <div>
              <p className="font-semibold">{item.productId.name}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div>₹{item.productId.price * item.quantity}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 font-bold text-lg">
        Total: ₹{totalPrice}
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
