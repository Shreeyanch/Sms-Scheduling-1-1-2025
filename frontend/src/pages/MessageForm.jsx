import React, { useEffect, useState } from "react";
import api from "../api/config";
import { toast } from "react-toastify";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    dateandtime: "",
  });
  const [historyOpen, setHistoryOpen] = useState(false); // Sidebar toggle state
  const [messageHistory, setMessageHistory] = useState([]);

  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index) => {
    // Toggle the clicked message visibility
    setClickedIndex(clickedIndex === index ? null : index);
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await api.get("/user/getMessages", {
        headers: { token },
      });
      console.log(response);
      if (response.data.success) {
        setMessageHistory(response.data.messages);
      }
    };
    fetchMessages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/user/scheduleMessage",
        { ...formData },
        { headers: { token } }
      );
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

      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Message History*/}
      <div
        className={`transition-transform duration-300 ${
          historyOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full bg-gray-800 text-white w-1/4 shadow-md z-10`}
      >
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-l-md shadow-md hover:bg-gray-700 transition-colors"
        >
          <span
            className={`transform transition-transform duration-300 ${
              historyOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            {historyOpen ? <ArrowBigLeft /> : <ArrowBigRight />}
          </span>
        </button>
        <h2 className="text-lg font-bold p-4 border-b border-gray-700">
          Message History
        </h2>
        <ul className="p-4 space-y-2">
          {[...messageHistory]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((message, index) => (
              <li
                key={index}
                className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 relative cursor-pointer"
                onClick={() => handleClick(index)}
              >
                <div className="flex justify-between items-center">
                  {/* Title */}
                  <p className="text-sm font-bold">{message.title}</p>

                  {/* Status */}
                  <p className="text-xs px-2 py-1 rounded-md bg-green-600 text-white">
                    {message.status.charAt(0).toUpperCase() +
                      message.status.slice(1)}
                  </p>
                </div>

                {/* Message */}
                <div
                  className={`my-2 w-full p-2 rounded-md transition-all duration-300 overflow-hidden ${
                    clickedIndex === index ? "" : "hidden"
                  }`}
                >
                  <p className="text-sm text-white">{message.message}</p>
                </div>

                {/* Created and Scheduled Dates */}
                <p className="text-xs">
                  Created Date: {new Date(message.createdAt).toLocaleString()}
                </p>
                <p className="text-xs">
                  Scheduled Date:{" "}
                  {new Date(message.dateandtime).toLocaleString()}
                </p>
              </li>
            ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-8 p-4">
        <div className="max-w-md mt-10 mx-auto p-4 bg-white shadow-md rounded-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Schedule a Message
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Enter title"
                required
              />
            </div>

            {/* Message Input */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message (max 100 characters)
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Enter message"
                maxLength="100"
                required
              ></textarea>
            </div>

            {/* Date and Time Input */}
            <div className="mb-4">
              <label
                htmlFor="dateandtime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date and Time
              </label>
              <input
                type="datetime-local"
                id="dateandtime"
                name="dateandtime"
                value={formData.dateandtime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-800 rounded-md hover:bg-green-900"
            >
              Schedule Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
