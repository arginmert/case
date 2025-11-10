import React from "react";

const ServisFiltreleri = ({
  hatlar,
  gunTipleri,
  servisSiraList,
  selectedHatId,
  selectedGunTipiId,
  selectedServisSira,
  handleHatChange,
  handleGunTipiChange,
  handleServisSiraChange,
  isLoading,
  error,
}) => {
  const SelectField = ({
    id,
    label,
    value,
    onChange,
    options,
    disabled,
    children,
  }) => (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {children || (
          <>
            <option value="">Seçiniz</option>
            {options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.hat_kodu || option.name || option.label}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );

  if (isLoading && !error) {
    return (
      <div className="text-center py-4 text-gray-600">
        Filtreler yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SelectField
        id="hatKodu"
        label="Hat Kodu"
        value={selectedHatId}
        onChange={handleHatChange}
        options={hatlar}
      />

      <SelectField
        id="gunTipi"
        label="Gün Tipi"
        value={selectedGunTipiId}
        onChange={handleGunTipiChange}
        options={gunTipleri}
        disabled={!selectedHatId}
      />

      <SelectField
        id="servisSira"
        label="Araç Sıra - (Servis No)"
        value={selectedServisSira}
        onChange={handleServisSiraChange}
        disabled={
          !selectedHatId || !selectedGunTipiId || servisSiraList.length === 0
        }
      >
        <option value="">Seçiniz</option>
        {servisSiraList.map((sira) => (
          <option key={sira.sira_no} value={sira.value}>
            {sira.label}
          </option>
        ))}
      </SelectField>
    </div>
  );
};

export default ServisFiltreleri;
