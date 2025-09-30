import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} QuickKart. All rights reserved.</p>
        
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-200">Privacy Policy</a>
          <a href="#" className="hover:text-gray-200">Terms of Service</a>
          <a href="#" className="hover:text-gray-200">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
