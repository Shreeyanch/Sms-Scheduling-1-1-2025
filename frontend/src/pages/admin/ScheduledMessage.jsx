import React, { useEffect, useState } from "react";
import api from "../../api/config";
import { toast } from "react-toastify";
import { EllipsisVertical } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ScheduledMessage = () => {
  const [messages, setMessages] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const messageStatus = queryParams.get("status");

  const allStatus = [
    { name: "All", id: "all" },
    { name: "SUBMITTED", id: "submitted" },
    { name: "PROCESSING", id: "processing" },
    { name: "CONFIRMED", id: "confirmed" },
    { name: "SENT", id: "sent" },
  ];

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/admin/getMessages", {
          headers: { token },
        });
        if (response.data.success) {
          setMessages(response.data.messages);
        } else {
          toast.error(response.data.message, { autoClose: 2000 });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch scheduled messages.", {
          autoClose: 2000,
        });
      }
    };

    fetchMessages();
  }, [token]);

  const toggleDropdown = (messageId) => {
    setDropdownOpen((prev) => (prev === messageId ? null : messageId));
  };

  // filter messages
  const messagesToRender =
    !messageStatus || messageStatus === "all"
      ? messages
      : messages.filter((message) => message.status === messageStatus);

  // change Message Status
  const handleStatusChange = async (messageId, status) => {
    try {
      const response = await api.put(
        "/admin/changeMessageStatus",
        { messageId, status },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            navigate(`/work?status=${status}`);
            window.location.reload();
          },
        });
      }
    } catch (error) {
      toast.error("Error Changing Status", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Scheduled Messages
      </h2>

      {/* Status Tabs */}
      <div className="flex space-x-4 mb-4">
        {allStatus.map((status) => (
          <button
            onClick={() => navigate(`/work?status=${status.id}`)}
            key={status.id}
            className={`p-2 px-4 rounded-md text-sm ${
              messageStatus
                ? status.id == messageStatus
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-700"
                : status.id == "all"
                ? "bg-teal-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status.name}
          </button>
        ))}
      </div>

      {/* Main Message Section */}
      {messages.length > 0 ? (
        <ul className="space-y-4">
          {messagesToRender.map((message) => (
            <li
              key={message._id}
              className="bg-gray-100 p-4 rounded-md shadow-md hover:bg-gray-200"
            >
              {/* Title */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">{message.title}</p>
                <div className="relative flex justify-end">
                  <EllipsisVertical
                    className="h-6 w-6 text-gray-500 cursor-pointer"
                    onClick={() => toggleDropdown(message._id)}
                  />
                  {dropdownOpen === message._id && (
                    <div className="absolute right-0 mt-5 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {allStatus
                        .filter(
                          (status) =>
                            status.id !== "all" && status.id !== message.status
                        )
                        .map((status) => (
                          <button
                            key={status.id}
                            onClick={() =>
                              handleStatusChange(message._id, status.id)
                            }
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                          >
                            {status.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message and Status */}
              <div className="mt-2 text-gray-700 mb-2 flex justify-between items-center">
                <span className="mr-10">
                  <strong>Message:</strong> {message.message}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-red-500 text-white">
                  {message.status.charAt(0).toUpperCase() +
                    message.status.slice(1)}
                </span>
              </div>

              {/* Created and Scheduled Dates */}
              <p className="text-sm text-gray-600">
                Created Date:{" "}
                <span className="font-medium">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Scheduled Date:{" "}
                <span className="font-medium">
                  {new Date(message.dateandtime).toLocaleString()}
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">
          No scheduled messages found.
        </p>
      )}
    </div>
  );
};

export default ScheduledMessage;
