import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Button from "../components/ui/Button";

function TanimTablosu({ title, apiUrl, sutunAdi, sutunAdi2 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [yeniAd, setYeniAd] = useState("");
  const [yeniOperatorTip, setYeniOperatorTip] = useState("");
  const [yeniAktif, setYeniAktif] = useState("Aktif");
  const [yeniGunTipi, setYeniGunTipi] = useState("");

  // Edit state
  const [editModu, setEditModu] = useState(null);
  const [editAdi, setEditAdi] = useState("");
  const [editOperatorTip, setEditOperatorTip] = useState("");
  const [editAktif, setEditAktif] = useState("Aktif");
  const [editGunTipi, setEditGunTipi] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(`${title} çekilirken hata:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const handleEkle = async (e) => {
    e.preventDefault();
    if (!yeniAd.trim()) {
      alert("Lütfen zorunlu alanları doldurunuz");
      return;
    }

    try {
      const newData = {
        name: yeniAd,
        ...(sutunAdi2 && { operatortip: yeniOperatorTip }),
        aktif: yeniAktif,
        ...(apiUrl.includes("gunTipleri") && { guntipi: yeniGunTipi }),
      };

      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      // Formu temizle ve modalı kapat
      setYeniAd("");
      setYeniOperatorTip("");
      setYeniAktif("Aktif");
      setYeniGunTipi("");
      setShowModal(false);

      // Verileri yeniden çek
      fetchData();

      alert("Kayıt başarıyla eklendi!");
    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Ekleme işlemi sırasında bir hata oluştu!");
    }
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchData();
        alert("Kayıt başarıyla silindi!");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silme işlemi sırasında bir hata oluştu!");
      }
    }
  };

  const handleEditKaydet = async (id) => {
    try {
      const updatedData = {
        name: editAdi,
        ...(sutunAdi2 && { operatortip: editOperatorTip }),
        aktif: editAktif,
        ...(apiUrl.includes("gunTipleri") && { guntipi: editGunTipi }),
      };

      await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      setEditModu(null);
      setEditAdi("");
      setEditOperatorTip("");
      setEditAktif("Aktif");
      setEditGunTipi("");
      fetchData();

      alert("Kayıt başarıyla güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme işlemi sırasında bir hata oluştu!");
    }
  };

  const enableEditModu = (row) => {
    setEditModu(row.id);
    setEditAdi(row.name || "");
    setEditOperatorTip(row.operatortip || "");
    setEditAktif(row.aktif || "Aktif");
    setEditGunTipi(row.guntipi || "");
  };

  const handleDoubleClick = (row) => {
    enableEditModu(row);
  };

  const handleCancelEdit = () => {
    setEditModu(null);
    setEditAdi("");
    setEditOperatorTip("");
    setEditAktif("Aktif");
    setEditGunTipi("");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setYeniAd("");
    setYeniOperatorTip("");
    setYeniAktif("Aktif");
    setYeniGunTipi("");
  };

  const getAktifDurumStili = (aktif) => {
    return aktif === "Aktif"
      ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      : "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
  };

  // Gün Tipleri için özel sütunlar
  const getColumns = () => {
    const baseColumns = [
      {
        name: sutunAdi,
        selector: (row) => row.name,
        sortable: true,
        cell: (row) =>
          editModu === row.id ? (
            <input
              type="text"
              value={editAdi}
              onChange={(e) => setEditAdi(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded"
              autoFocus
            />
          ) : (
            <div
              onDoubleClick={() => handleDoubleClick(row)}
              className="py-2 cursor-pointer"
            >
              {row.name}
            </div>
          ),
      },
    ];

    // Gün Tipi sütunu - sadece gunTipleri için
    if (apiUrl.includes("gunTipleri")) {
      baseColumns.push({
        name: "Gün Tipi",
        selector: (row) => row.guntipi,
        sortable: true,
        width: "120px",
        cell: (row) =>
          editModu === row.id ? (
            <input
              type="text"
              value={editGunTipi}
              onChange={(e) => setEditGunTipi(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded"
              placeholder="I, CT, PZ vb."
            />
          ) : (
            <div
              onDoubleClick={() => handleDoubleClick(row)}
              className="py-2 cursor-pointer text-center font-mono"
            >
              {row.guntipi}
            </div>
          ),
      });
    }

    // Operatör Tipi sütunu - sadece sutunAdi2 varsa
    if (sutunAdi2) {
      baseColumns.push({
        name: sutunAdi2,
        selector: (row) => row.operatortip,
        width: "150px",
        sortable: true,
        cell: (row) =>
          editModu === row.id ? (
            <input
              type="text"
              value={editOperatorTip}
              onChange={(e) => setEditOperatorTip(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded"
            />
          ) : (
            <div
              onDoubleClick={() => handleDoubleClick(row)}
              className="py-2 cursor-pointer"
            >
              {row.operatortip}
            </div>
          ),
      });
    }

    // Aktif sütunu
    baseColumns.push({
      name: "Aktif",
      selector: (row) => row.aktif,
      sortable: true,
      width: "100px",
      cell: (row) =>
        editModu === row.id ? (
          <select
            value={editAktif}
            onChange={(e) => setEditAktif(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          >
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
          </select>
        ) : (
          <div
            onDoubleClick={() => handleDoubleClick(row)}
            className="cursor-pointer"
          >
            <span className={getAktifDurumStili(row.aktif)}>{row.aktif}</span>
          </div>
        ),
    });

    // İşlemler sütunu
    baseColumns.push({
      name: "İşlemler",
      width: "220px",
      cell: (row) => (
        <div className="flex gap-2">
          {editModu === row.id ? (
            <>
              <button
                onClick={() => handleEditKaydet(row.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
              >
                Kaydet
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
              >
                İptal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => enableEditModu(row)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
              >
                Güncelle
              </button>
              <button
                onClick={() => handleSil(row.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
              >
                Sil
              </button>
            </>
          )}
        </div>
      ),
    });

    return baseColumns;
  };

  const isGunTipleri = apiUrl.includes("gunTipleri");

  return (
    <div className="flex flex-col gap-5 mb-10">
      <h3 className="text-red-500 font-black underline text-center text-2xl mb-2">
        {title}
      </h3>

      {/* Tablo */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTable
          columns={getColumns()}
          data={data}
          progressPending={loading}
          pagination
          highlightOnHover
          noDataComponent={
            <div className="p-4 text-center text-gray-500">Veri bulunamadı</div>
          }
        />
      </div>

      {/* Ekle Butonu */}
      <div className="flex justify-center mt-4">
        <Button text={`${sutunAdi} Kaydet`} color="gray" onClick={openModal} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Yeni {sutunAdi} Ekle
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEkle} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {sutunAdi} *
                  </label>
                  <input
                    type="text"
                    placeholder={`${sutunAdi} giriniz...`}
                    value={yeniAd}
                    onChange={(e) => setYeniAd(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Gün Tipi Kodu alanı - sadece gunTipleri için */}
                {isGunTipleri && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gün Tipi
                    </label>
                    <input
                      type="text"
                      placeholder="I, CT, PZ vb. giriniz..."
                      value={yeniGunTipi}
                      onChange={(e) => setYeniGunTipi(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {sutunAdi2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {sutunAdi2}
                    </label>
                    <input
                      type="text"
                      placeholder={`${sutunAdi2} giriniz...`}
                      value={yeniOperatorTip}
                      onChange={(e) => setYeniOperatorTip(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durum
                  </label>
                  <select
                    value={yeniAktif}
                    onChange={(e) => setYeniAktif(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TanimTablosu;
