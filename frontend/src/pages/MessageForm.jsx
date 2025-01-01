import React, { useState } from "react";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    dateandtime: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    

    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-md mt-10 mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Schedule a Message</h2>

      {/* Error Message */}
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

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
            Message (max 30 characters)
          </label>
          <input
            type="textarea"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter message"
            maxLength="100"
            required
          />
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
  );
};

export default MessageForm;
