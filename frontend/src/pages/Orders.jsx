import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0)
    return <div className="p-4">You have no orders yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold mb-1">
              Order ID: {order._id}
            </h2>
            <p>Status: <span className="font-bold">{order.status}</span></p>
            <p>Total Price: ₹{order.totalPrice}</p>
            <div className="mt-2">
              <h3 className="font-semibold">Products:</h3>
              <ul className="list-disc list-inside">
                {order.products.map((item) => (
                  <li key={item._id}>
                    {item.productId?.name || "Product"} - Quantity: {item.quantity} - ₹{item.productId?.price || 0}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
