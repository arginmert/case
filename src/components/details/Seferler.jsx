import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(date);
  } catch (e) {
    return "";
  }
};

const Seferler = ({
  title,
  orerler,
  onOrerChange,
  onAddOrer,
  onDeleteOrer,
}) => {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    rowIndex: null, // Artık satır index'ini tutuyoruz
  });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu({ ...menu, visible: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menu, menuRef]);

  // Gidiş ve Dönüş seferlerini ayır ve eşleştir
  const gidisOrerler = orerler.filter((orer) => orer.yon === "G");
  const donusOrerler = orerler.filter((orer) => orer.yon === "D");
  const maxRows = Math.max(gidisOrerler.length, donusOrerler.length);

  // Eşleştirilmiş satırları oluştur
  const pairedRows = Array.from({ length: maxRows }).map((_, index) => ({
    gidis: gidisOrerler[index],
    donus: donusOrerler[index],
    rowIndex: index,
  }));

  // Başlık rengini belirle
  const getHeaderColor = () => {
    if (title.includes("Akşam")) return "bg-blue-900 text-white";
    if (title.includes("Sefer Saatleri")) return "bg-cyan-500 text-white";
    return "bg-gray-100";
  };

  // Satıra sağ tıklandığında menüyü açar
  const handleContextMenu = (e, rowIndex) => {
    e.preventDefault();
    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      rowIndex: rowIndex,
    });
  };

  // Menüdeki bir seçeneğe tıklandığında
  const handleMenuClick = (action) => {
    if (menu.rowIndex === null) return;

    // Bu satırdaki gidiş veya dönüş seferlerinden birini bul
    const currentRow = pairedRows[menu.rowIndex];
    const targetOrerId = currentRow.gidis?.id || currentRow.donus?.id;

    if (targetOrerId) {
      if (action === "addAbove") {
        onAddOrer(targetOrerId, "above");
      } else if (action === "addBelow") {
        onAddOrer(targetOrerId, "below");
      } else if (action === "delete") {
        // Hem gidiş hem dönüşü sil
        if (currentRow.gidis) onDeleteOrer(currentRow.gidis.id);
        if (currentRow.donus) onDeleteOrer(currentRow.donus.id);
      }
    } else {
      // Eğer satır boşsa, sona ekle
      if (action === "addBelow") {
        const lastOrer = orerler[orerler.length - 1];
        if (lastOrer) {
          onAddOrer(lastOrer.id, "below");
        } else {
          // Hiç sefer yoksa, özel olarak ekle
          onAddOrer(null, "below");
        }
      }
    }

    setMenu({ ...menu, visible: false });
  };

  // Input değiştiğinde ana hook'u tetikle
  const handleInputChange = (orerId, fieldName, newValue) => {
    onOrerChange(orerId, fieldName, newValue);
  };

  if (!orerler) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-2 relative">
      <h3
        className={`text-lg font-semibold p-2 rounded-t-2xl ${getHeaderColor()}`}
      >
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[800px]">
          <thead>
            <tr className="bg-gray-100">
              {/* Gidiş Kolonları */}
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                id
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                süre
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Gidiş Saati
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Gidiş Güzergahı
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                R
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Gidiş Açıklama
              </th>

              {/* Dönüş Kolonları */}
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                dId
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Süre
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Dönüş Saati
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Dönüş Güzergahı
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                R
              </th>
              <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                Dönüş Açıklama
              </th>
            </tr>
          </thead>
          <tbody>
            {pairedRows.length === 0 ? (
              <tr>
                <td
                  colSpan="12"
                  className="p-4 text-center text-gray-500 text-xs sm:text-sm"
                >
                  Bu blok için sefer bulunmamaktadır.
                </td>
              </tr>
            ) : (
              pairedRows.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50"
                  onContextMenu={(e) => handleContextMenu(e, index)}
                >
                  {/* GİDİŞ KOLONLARI */}
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {row.gidis?.id || ""}
                  </td>
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {/* Süre bilgisi buraya gelecek */}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.gidis && (
                      <input
                        type="time"
                        value={formatTime(row.gidis.saat)}
                        onChange={(e) =>
                          handleInputChange(
                            row.gidis.id,
                            "saat",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.gidis && (
                      <input
                        type="text"
                        value={row.gidis.guzergah?.guzergah_kodu || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.gidis.id,
                            "guzergah_kodu",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {/* R sütunu - boş */}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.gidis && (
                      <input
                        type="text"
                        value={row.gidis.aciklama || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.gidis.id,
                            "aciklama",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>

                  {/* DÖNÜŞ KOLONLARI */}
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {row.donus?.id || ""}
                  </td>
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {/* Süre bilgisi buraya gelecek */}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.donus && (
                      <input
                        type="time"
                        value={formatTime(row.donus.saat)}
                        onChange={(e) =>
                          handleInputChange(
                            row.donus.id,
                            "saat",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.donus && (
                      <input
                        type="text"
                        value={row.donus.guzergah?.guzergah_kodu || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.donus.id,
                            "guzergah_kodu",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                    {/* R sütunu - boş */}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {row.donus && (
                      <input
                        type="text"
                        value={row.donus.aciklama || ""}
                        onChange={(e) =>
                          handleInputChange(
                            row.donus.id,
                            "aciklama",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-xs sm:text-sm"
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SAĞ TIK MENÜSÜ */}
      {menu.visible && (
        <div
          ref={menuRef}
          style={{ top: menu.y, left: menu.x, position: "fixed", zIndex: 1000 }}
          className="bg-white border shadow-lg rounded-md py-1 w-48"
        >
          <button
            onClick={() => handleMenuClick("addAbove")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Üste Satır Ekle (Gidiş+Dönüş)
          </button>
          <button
            onClick={() => handleMenuClick("addBelow")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Alta Satır Ekle (Gidiş+Dönüş)
          </button>
          <button
            onClick={() => handleMenuClick("delete")}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Satırı Sil (Gidiş+Dönüş)
          </button>
        </div>
      )}
    </div>
  );
};

export default Seferler;
