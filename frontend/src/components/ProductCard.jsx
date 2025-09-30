import React from "react";

const ProductCard = ({ product, onAddToCart, onAddToFavourites }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={product.image || "https://img.freepik.com/free-psd/full-shopping-cart-groceries_191095-79355.jpg?semt=ais_hybrid&w=740&q=80"}
        alt={product.name}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-600 font-semibold mt-1">₹{product.price}</p>
      <div className="flex justify-between mt-2">
        <button
          onClick={() => onAddToCart(product._id)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>
        <button
          onClick={() => onAddToFavourites(product._id)}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
