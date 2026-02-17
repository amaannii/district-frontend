import React, { useState } from "react";

function Informations() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [contacts, setContacts] = useState([]); // Stored numbers
  const [newNumber, setNewNumber] = useState("");

  // Save contact number
  const handleSaveContact = () => {
    if (!newNumber.trim()) return;

    setContacts([...contacts, newNumber]);
    setNewNumber("");
    setShowAddModal(false);
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
        className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer mb-5"
      >
        <span className="text-gray-300 text-sm">Contact info</span>
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

      {/* Birthday Row */}
      <div className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer">
        <span className="text-gray-300 text-sm">Birthday</span>
        <span className="text-gray-400 text-xl">{">"}</span>
      </div>

      {/* ========================= */}
      {/* CONTACT INFO MODAL */}
      {/* ========================= */}
     {showContactModal && (
<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

  {/* Modal Box */}
  <div className="w-[650px] bg-black text-white 
                  border-2 border-gray-700 
                  rounded-2xl p-10 relative">

    {/* Close Button */}
    <button
      onClick={() => setShowContactModal(false)}
      className="absolute top-6 right-6 text-gray-400 text-2xl hover:text-white"
    >
      ✕
    </button>

    {/* Title */}
    <h2 className="text-3xl font-bold mb-6">
      Contact information
    </h2>

    {/* Contact Box */}
    <div className="border border-gray-700 rounded-xl overflow-hidden">

      {/* Contact Row */}
      {contacts.length === 0 ? (
        <div className="px-6 py-5 text-gray-400 text-sm">
          No contact added yet.
        </div>
      ) : (
        contacts.map((num, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-6 py-5 border-b border-gray-700"
          >
            <div>
              <p className="text-sm text-white">{num}</p>
              <p className="text-xs text-gray-500">
                Pending confirmation
              </p>
            </div>

            <span className="text-gray-400 text-2xl">{">"}</span>
          </div>
        ))
      )}

      {/* Add New Contact */}
      <button
        onClick={() => {
          setShowContactModal(false);
          setShowAddModal(true);
        }}
        className="w-full text-left px-6 py-5 text-blue-500 hover:bg-[#111]"
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
          <div className="bg-[#111] w-[400px] rounded-2xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">Add Contact Number</h2>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter phone number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black border border-gray-600 text-white mb-4"
            />

            {/* Save Button */}
            <button
              onClick={handleSaveContact}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-xl font-semibold"
            >
              Save Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Informations;
