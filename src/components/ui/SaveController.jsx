import React from "react";
import { Save } from "lucide-react";
import Button from "./Button";

const SaveController = ({ onSave, isSaving, saveStatus }) => (
  <div className="flex items-center gap-4 mt-5">
    <div className="flex-1">
      {saveStatus?.type === "success" && (
        <p className="text-green-600 font-medium text-sm">
          {saveStatus.message}
        </p>
      )}
      {saveStatus?.type === "error" && (
        <p className="text-red-600 font-medium text-sm">{saveStatus.message}</p>
      )}
    </div>
    <Button
      text={`${isSaving ? "Kaydediliyor..." : "Kaydet"}`}
      onClick={onSave}
      className='${
        isSaving
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-500"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}'
    />
  </div>
);

export default SaveController;
