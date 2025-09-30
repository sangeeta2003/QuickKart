import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import api from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Fetch cart count when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const res = await api.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const totalCount = res.data.cart.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          setCartCount(totalCount);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCart();
  }, [user]);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await api.get(`/products/search?q=${search}`);
      console.log("Search results:", res.data);
      // Navigate to search results page if needed
      // navigate(`/search?q=${search}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-md py-3 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-blue-600">Quick</span>
          <span className="text-green-600 ml-1">Kart</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Right Icons: User & Cart */}
        <div className="flex items-center space-x-15">
          {/* Profile / Login */}
          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition"
          >
            <FaUser className="w-5 h-5" />
            <span className="hidden sm:inline">
              {user ? user.name : "Login"}
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            <FaShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
