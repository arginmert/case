import { useState } from "react";

// Reusable Select Component
function SelectBtn({
  id,
  name,
  label,
  value,
  options,
  onChange,
  className = "",
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      >
        <option value="">Seçiniz</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Ana Component
function MainForm() {
  const [formData, setFormData] = useState({
    hatKodu: "",
    gunTipi: "",
  });

  const [selectData, setSelectData] = useState({});

  useEffect(() => {
    // JSON verilerini yükle
    const loadData = async () => {
      const data = {
        hatKodlari: [
          { value: "HAT1", label: "Hat 1" },
          { value: "HAT2", label: "Hat 2" },
        ],
        gunTipleri: [
          { value: "HAFTAICI", label: "Hafta İçi" },
          { value: "HAFTA_SONU", label: "Hafta Sonu" },
        ],
      };
      setSelectData(data);
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <DynamicSelect
        id="hatKodu"
        name="hatKodu"
        label="Hat Kodu"
        value={formData.hatKodu}
        options={selectData.hatKodlari || []}
        onChange={handleChange}
      />

      <DynamicSelect
        id="gunTipi"
        name="gunTipi"
        label="Gün Tipi"
        value={formData.gunTipi}
        options={selectData.gunTipleri || []}
        onChange={handleChange}
      />
    </div>
  );
}
export default SelectBtn;
