import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    try {
      await api.post("/users/cart/add", { productId: id, quantity: 1 });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  // Add to favorites
  const handleAddToFavorites = async () => {
    try {
      await api.post(`/favorites/${id}`);
      alert("Added to favorites!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to favorites");
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    try {
      await api.post(`/products/${id}/reviews`, review);
      alert("Review submitted!");
      fetchProduct(); // refresh reviews
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-1/3 h-auto rounded"
        />
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <div className="font-semibold text-lg">₹{product.price}</div>
          <div className="space-x-2">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToFavorites}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Add to Favorites
            </button>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            {product.reviews.length === 0 && <p>No reviews yet.</p>}
            {product.reviews.map((rev) => (
              <div
                key={rev._id}
                className="border-b py-2 flex justify-between items-center"
              >
                <span>
                  <strong>{rev.userId.name}</strong>: {rev.comment}
                </span>
                <span>Rating: {rev.rating}/5</span>
              </div>
            ))}

            {/* Add Review */}
            <div className="mt-4">
              <h3 className="font-semibold">Add a Review</h3>
              <select
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: Number(e.target.value) })
                }
                className="border p-1 rounded mr-2"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                placeholder="Write a comment"
                className="border p-1 rounded mr-2"
              />
              <button
                onClick={handleSubmitReview}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
