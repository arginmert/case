import React from "react";

const ServisBilgileriEditor = ({
  bilgi,
  onBilgiChange,
  aracTipiList,
  servisTipiList,
  garList,
  garajList,
  isDisabled,
}) => {
  const currentBilgi = bilgi || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedNestedObject = null;
    let propertyName = null;

    if (name === "servis_tipi_id") {
      propertyName = "servis_tipi";
      const selectedItem = servisTipiList.find(
        (item) => String(item.id) === value
      );
      updatedNestedObject = selectedItem
        ? { id: selectedItem.id, servis_tipi: selectedItem.name }
        : null;
    } else if (name === "arac_tipi_id") {
      propertyName = "arac_tipi";
      const selectedItem = aracTipiList.find(
        (item) => String(item.id) === value
      );
      updatedNestedObject = selectedItem
        ? { id: selectedItem.id, arac_tipi: selectedItem.name }
        : null;
    } else if (name === "garaj_id") {
      propertyName = "garaj";
      const selectedItem = garajList.find((item) => String(item.id) === value);
      updatedNestedObject = selectedItem
        ? { id: selectedItem.id, ase_garaj: selectedItem.ase_garaj }
        : null;
    } else if (name === "gar_id") {
      propertyName = "gar";
      const selectedItem = garList.find((item) => String(item.id) === value);
      updatedNestedObject = selectedItem
        ? { id: selectedItem.id, gar_adi: selectedItem.gar_adi }
        : null;
    }

    if (propertyName) {
      onBilgiChange({ ...currentBilgi, [propertyName]: updatedNestedObject });
    }
  };

  const renderSelect = (label, id, name, value, options) => (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value || ""}
        onChange={handleChange}
        disabled={isDisabled}
        className={`w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm ${
          isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        <option value="">Seçiniz</option>
        {options.map((item) => (
          <option key={`${item.id}-${item.keySuffix}`} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {renderSelect(
        "Servis Tipi",
        "servisTipi",
        "servis_tipi_id",
        currentBilgi.servis_tipi?.id,
        servisTipiList.map((item) => ({
          ...item,
          name: item.name,
          keySuffix: item.name,
        }))
      )}
      {renderSelect(
        "Araç Tipi",
        "aracTipi",
        "arac_tipi_id",
        currentBilgi.arac_tipi?.id,
        aracTipiList.map((item) => ({
          ...item,
          name: item.name,
          keySuffix: item.name,
        }))
      )}
      {renderSelect(
        "Servis Garajı",
        "servisGaraji",
        "garaj_id",
        currentBilgi.garaj?.id,
        garajList.map((item) => ({
          id: item.id,
          name: item.ase_garaj,
          keySuffix: item.ase_garaj,
        }))
      )}
      {renderSelect(
        "Gar Yeri",
        "garYeri",
        "gar_id",
        currentBilgi.gar?.id,
        garList.map((item) => ({
          id: item.id,
          name: item.gar_adi,
          keySuffix: item.gar_adi,
        }))
      )}
    </div>
  );
};

export default ServisBilgileriEditor;
