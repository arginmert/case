import React from "react";
import { Edit } from "lucide-react";

const HatNotlari = ({ notlar, onNotlarChange, isDisabled }) => {
  const handleNotChange = (e) => {
    onNotlarChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Edit size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Hat Notları</h3>
      </div>

      <textarea
        value={notlar || ""}
        onChange={handleNotChange}
        disabled={isDisabled}
        placeholder="Hat notlarını buraya yazın..."
        className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default HatNotlari;
