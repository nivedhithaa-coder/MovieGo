import React, { useState } from "react";

const RoleSelectionModal = ({ onSubmit }) => {
  const [role, setRole] = useState("user"); // default role

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Select your role</h2>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-black text-black px-2 py-2 mb-4 w-full rounded"
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="user">User</option>
          <option value="admin">Theatre Admin</option>
        </select>
        <button
          onClick={() => onSubmit(role)}
          className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
