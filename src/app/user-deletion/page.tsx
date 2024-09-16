import React from "react";

const DeletionConfirmation = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Data Deletion Successful 🎉</h1>
        <p className="text-lg mb-4">
          Your data has been successfully deleted from our system. If you have
          any questions, feel free to reach out to our support team.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Back to Homepage
        </a>
      </div>
    </div>
  );
};

export default DeletionConfirmation;
