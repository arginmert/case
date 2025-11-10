import React from "react";
import { Clock } from "lucide-react";

const DetayDurumGostergesi = ({
  isDetayLoading,
  error,
  editableBilgi,
  selectedServisSira,
}) => {
  if (isDetayLoading) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Servis detayı yükleniyor...
        </div>
      </div>
    );
  }

  if (error && !editableBilgi && selectedServisSira) {
    return (
      <div className="bg-white rounded-lg border p-4 text-red-600 text-sm">
        {error}
      </div>
    );
  }

  if (!editableBilgi && !selectedServisSira) {
    return <div className="bg-white rounded-lg p-6 text-center"></div>;
  }

  return null;
};

export default DetayDurumGostergesi;
