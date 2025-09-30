import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  const fetchFavourites = async () => {
    try {
      const res = await api.get("/favourites");
      setFavourites(res.data.favourites);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/favourites/${productId}`);
      fetchFavourites();
    } catch (err) {
      console.error(err);
    }
  };

  if (favourites.length === 0)
    return <div className="p-4">No favourite products yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favourites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favourites.map((product) => (
          <div
            key={product._id}
            className="border rounded p-4 flex flex-col items-center"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover mb-2"
              />
            )}
            <h2 className="font-semibold">{product.name}</h2>
            <p>Price: ₹{product.price}</p>
            <button
              onClick={() => handleRemove(product._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
