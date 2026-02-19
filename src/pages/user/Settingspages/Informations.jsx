import axios from "axios";
import React, { useEffect, useState } from "react";

function Informations() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contacts, setContacts] = useState([]); // Stored numbers
  const [newNumber, setNewNumber] = useState("");
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userdetails, setuserdetails] = useState({});
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);

  const [month, setMonth] = useState("December");
  const [day, setDay] = useState("30");
  const [year, setYear] = useState("2001");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get("http://localhost:3001/user/getContacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const user = response.data.user;
        setuserdetails(user);
        setContacts(res.data.contacts);
        // ✅ Load birthday from backend
        if (user.birthday) {
          setMonth(user.birthday.month);
          setDay(user.birthday.day);
          setYear(user.birthday.year);
        }
      } catch (err) {
        console.log("Error fetching contacts:", err);
      }
    };
    if (showAddModal) {
      setNewNumber("");
    }

    fetchContacts();
  }, [showAddModal, ShowEditModal]);

  // Save contact number
  const handleSaveContact = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/addContact",
        { number: newNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContacts(res.data.contacts);
      setShowAddModal(false);
      setNewNumber("");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleDeleteNumber = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/deleteContact",
        { number: selectedNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setContacts(res.data.contacts);

      // Close modals after delete
      setShowNumberModal(false);
      setSelectedNumber(null);
    } catch (err) {
      alert("Error deleting number");
    }
  };

  const handleUpdateNumber = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/updateContact",
        {
          newNumber: newNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ✅ Update contact immediately in UI
      setContacts(newNumber);

      // Close modals
      setShowEditModal(false);
      setShowNumberModal(false);
      setSelectedNumber(newNumber);
    } catch (err) {
      alert("Error updating number");
    }
  };

  const handleSaveBirthday = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/updateBirthday",
        {
          month,
          day,
          year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Birthday Saved ✅");
      // ✅ Update UI instantly without refresh
      setMonth(res.data.birthday.month);
      setDay(res.data.birthday.day);
      setYear(res.data.birthday.year);

      setShowBirthdayModal(false);
    } catch (err) {
      alert("Error saving birthday ❌");
    }
  };

  return (
    <div className="play-regular text-white">
      {/* Page Title */}
      <h1 className="text-xl font-bold mb-10">
        Your information and permissions
      </h1>

      {/* Contact Info Row */}
      <div
        onClick={() => setShowContactModal(true)}
        className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer mb-1"
      >
        <span className="text-gray-300 text-sm">Contact info</span>
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

      {/* Birthday Row */}
      {/* Birthday Row */}
      <div
        onClick={() => setShowBirthdayModal(true)}
        className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer"
      >
        <div>
          <p className="text-gray-300 text-sm">Birthday</p>

          {/* ✅ Show saved birthday */}
          <p className="text-gray-500 text-xs">
            {month} {day}, {year}
          </p>
        </div>

        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

      {/* ========================= */}
      {/* CONTACT INFO MODAL */}
      {/* ========================= */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          {/* Modal Box */}
          <div
            className="w-[650px] bg-black text-white 
                  border-2 border-gray-700 
                  rounded-2xl p-10 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
            >
              x
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-6">Contact information</h2>

            {/* Contact Box */}
            <div className="border border-gray-700 rounded-xl overflow-hidden">
              {/* Contact Row */}
              {!contacts ? (
                <div className="px-6 py-5 text-gray-400 text-sm">
                  No contact added yet.
                </div>
              ) : (
                <div
                  onClick={() => {
                    setSelectedNumber(contacts);

                    // ✅ also show it in add modal input
                    setNewNumber(contacts);

                    setShowNumberModal(true);
                  }}
                  className="flex items-center justify-between px-6 py-5 border-b border-gray-700 cursor-pointer hover:bg-[#111]"
                >
                  <div>
                    <p className="text-sm text-white">{contacts}</p>
                    <p className="text-xs text-gray-500">
                      Pending confirmation
                    </p>
                  </div>

                  <span className="text-gray-400 text-2xl">{">"}</span>
                </div>
              )}

              {/* Add New Contact */}
              <button
                onClick={() => {
                  setShowContactModal(false);

                  // ✅ Show first contact in input if exists

                  setShowAddModal(true);
                }}
                className="w-full text-left px-6 py-5 text-[#879F00] hover:bg-[#111]"
              >
                Add new contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* ADD CONTACT MODAL */}
      {/* ========================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          {/* Modal Box */}
          <div
            className="w-[450px] bg-black text-white
                 border-2 border-gray-800
                 rounded-2xl p-8 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
            >
              x
            </button>

            {/* Title (Same Content) */}
            <h2 className="text-2xl font-bold mb-6">Add Contact Number</h2>

            {/* Input (Same Content) */}
            <input
              type="text"
              placeholder="Enter phone number"
              value={newNumber}
              disabled={contacts && contacts.length > 0}
              onChange={(e) => setNewNumber(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-black
    border border-gray-700 text-white
    focus:outline-none focus:border-gray-500 mb-3
    ${contacts && contacts.length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {contacts && contacts.length > 0 && (
              <p className="text-red-500 text-sm mb-4">
                Number already added. You can only edit or delete it.
              </p>
            )}

            {/* Save Button (Same Content) */}
            <button
              onClick={handleSaveContact}
              disabled={contacts ? true : false}
              className={`w-full py-2 rounded-xl font-semibold text-lg transition
                {contacts && (
  <p>Number already added</p>
)}

    ${
      contacts && contacts.length > 0
        ? "bg-[#879F00]/50 cursor-not-allowed"
        : "bg-[#879F00] hover:bg-[#6f8500]"
    }`}
            >
              Save Contact
            </button>
          </div>
        </div>
      )}

      {showNumberModal && selectedNumber && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="w-[750px] bg-black border border-gray-700 rounded-2xl p-10 relative">
            {/* Close */}
            <button
              onClick={() => setShowNumberModal(false)}
              className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
            >
              ✕
            </button>

            {/* Number Big */}
            <h2 className="text-2xl font-bold mb-2">{selectedNumber}</h2>

            {/* Subtitle */}
            <p className="text-sm text-gray-400 mb-6">
              You added this number to these accounts.{" "}
              <span className="text-[#879F00] cursor-pointer">
                Who can see your number.
              </span>
            </p>

            {/* Account Box */}
            <div className="bg-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 mb-8">
              {/* Profile Pic */}
              <img
                src={userdetails.img}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />

              {/* Username */}
              <div>
                <p className="text-black font-semibold text-sm">
                  {userdetails.username}
                </p>
                <p className="text-gray-600 text-xs">pending confirmation</p>
              </div>
            </div>

            {/* Actions */}
            <div className="border border-gray-700 rounded-xl overflow-hidden">
              {/* Confirm */}
              <button
                onClick={() => {
                  setShowEditModal(true); // ✅ Open edit modal
                  setNewNumber(selectedNumber); // ✅ Fill input with selected number
                }}
                className="w-full text-left px-6 py-4 text-[#879F00] hover:bg-[#111] text-sm"
              >
                Edit number
              </button>

              {/* Delete */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-left px-6 py-4 text-red-500 hover:bg-[#111] text-sm border-t border-gray-700"
              >
                Delete number
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60]">
          {/* Confirm Box */}
          <div className="w-[400px] bg-black border border-gray-700 rounded-2xl p-6">
            {/* Title */}
            <h2 className="text-lg font-bold mb-3">Delete contact number?</h2>

            {/* Message */}
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{selectedNumber}</span>
              ? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              {/* Cancel */}
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-[#111]"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                onClick={() => {
                  handleDeleteNumber();
                  setShowDeleteConfirm(false);
                }}
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================= */}
      {/* EDIT NUMBER MODAL */}
      {/* ========================= */}
      {ShowEditModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[70]">
          <div className="w-[450px] bg-black border border-gray-700 rounded-2xl p-8 relative">
            {/* Close */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6">Edit Contact Number</h2>

            {/* Input */}
            <input
              type="text"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black
        border border-gray-700 text-white
        focus:outline-none focus:border-gray-500 mb-6"
            />

            {/* Save Button */}
            <button
              onClick={handleUpdateNumber}
              className="w-full bg-[#879F00] py-2 rounded-xl font-semibold text-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* BIRTHDAY MODAL */}
      {/* ========================= */}
      {showBirthdayModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[80]">
          <div className="w-[750px] bg-black border border-gray-700 rounded-2xl p-10 relative">
            {/* Close */}
            <button
              onClick={() => setShowBirthdayModal(false)}
              className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
            >
              x
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-2">Edit your birthday</h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-8">
              This birthday is used for the accounts. Any changes you make will
              apply to all of them.
            </p>

            {/* Dropdowns */}
            <div className="flex gap-6 mb-6">
              {/* Month */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-black border border-gray-600 rounded-xl px-3 py-3 text-white focus:outline-none"
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>

              {/* Day */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>

              {/* Year */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i}>{2025 - i}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <p className="text-gray-500 text-xs mb-8">
              Note: This is the last time you can edit your birthday. After
              this, you'll have to wait before you can edit it again.
            </p>

            {/* Save Button */}
            <button
              onClick={handleSaveBirthday}
              className="w-full bg-[#879F00] hover:bg-[#6f8500] py-3 rounded-xl font-semibold text-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Informations;
