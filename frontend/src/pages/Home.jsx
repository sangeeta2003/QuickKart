import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      {/* Hero Section */}
     <section className="bg-green-600 p-4 rounded-xl mb-6 shadow-md flex flex-col items-center max-w-7xl mx-auto">
  {/* Hero Image */}
  <div className="w-full flex justify-center mb-4">
    <img
      src="https://npr.brightspotcdn.com/dims3/default/strip/false/crop/5820x3880+0+0/resize/1100/quality/50/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F41%2F25%2F0eb0f61f4cc1b46b662d798d621e%2Fwoman-and-fruit.jpg"
      alt="Hero Illustration"
      className="w-full h-40 object-cover rounded-xl"
    />
  </div>

  {/* Text */}
  <div className="text-center">
    <h1 className="text-2xl font-bold mb-1 text-white">
      Welcome to QuickKart
    </h1>
    <p className="text-white text-sm">
      Shop fresh groceries and daily essentials at unbeatable prices!
    </p>
  </div>
</section>




      {/* Products Grid */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 p-4 rounded-xl shadow hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover mb-4 rounded-xl"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold text-green-700 text-lg">₹{product.price}</span>
              <Link
                to={`/products/${product._id}`}
                className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
