import React, { useState } from "react";
import logo from "/images.jpeg";
import { User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-200 px-6 py-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Samparka Logo" className="h-8" />
        <span className="text-lg font-bold text-gray-700">Samparka</span>
      </div>
      {token ? (
        <div className="flex items-center space-x-4">
          {/* Admin-Only Buttons */}
          {user.role === "admin" && (
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm text-white bg-green-800 rounded-md hover:bg-green-900">
                Users
              </button>
              <button className="px-4 py-2 text-sm text-white bg-green-800 rounded-md hover:bg-green-900">
                Work
              </button>
            </div>
          )}

          {/* User Icon with Dropdown */}
          <div className="relative">
            <button
              className="relative flex rounded-full bg-green-800 text-sm"
              onClick={toggleDropdown}
            >
              <User className="h-8 w-auto p-1 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md">
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("View Profile")}
                >
                  User Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        //   {/* Login Button */}
        <button className="px-4 py-2 text-sm text-white bg-green-800 rounded-md hover:bg-green-900">
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;