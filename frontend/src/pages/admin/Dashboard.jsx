import React, { useEffect, useState } from "react";
import api from "../../api/config";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/admin/getUsers", { headers: { token } });
      console.log(response);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    };
    fetchUsers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/admin/createUser",
        { newUser },
        { headers: { token } }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(error, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">User Dashboard</h1>
        <button
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Create New User
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-gray-600">
                Encrypted Password
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2 text-gray-700">{user._id}</td>
                <td className="px-4 py-2 text-gray-700">{user.email}</td>
                <td className="px-4 py-2 text-gray-700">{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating New User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={newUser.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
