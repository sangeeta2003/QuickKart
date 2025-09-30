import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams(); // Product ID from URL
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: "" });

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", { productId: id, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToFavourites = async () => {
    try {
      await api.post(`/favorites/${id}`);
      alert("Added to favourites");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await api.post(`/products/${id}/reviews`, review);
      alert("Review submitted");
      setReview({ rating: 0, comment: "" });
      fetchProduct(); // refresh reviews
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full md:w-1/3 rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="text-green-600 font-semibold mt-2">₹{product.price}</p>
          <p className="text-gray-500 mt-1">Quantity: {product.quantity}</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToFavourites}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              ♥ Add to Favourites
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Reviews</h2>
        {product.reviews.length === 0 && <p>No reviews yet.</p>}
        {product.reviews.map((rev) => (
          <div key={rev._id} className="border p-2 rounded mb-2">
            <p>
              <span className="font-bold">{rev.userId?.name || "User"}:</span>{" "}
              {rev.comment}
            </p>
            <p>Rating: {rev.rating} ⭐</p>
          </div>
        ))}

        {/* Add Review */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Add Your Review</h3>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            className="border p-2 rounded w-24 mb-2"
          />
          <textarea
            placeholder="Comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleSubmitReview}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
