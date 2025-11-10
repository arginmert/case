import React from "react";
import { Clock, Info } from "lucide-react";

// formatTime: ISO string'i alır, HH:mm string'i döndürür.
const formatTime = (dateString) => {
  if (!dateString) return ""; // Veri null ise boş string döndür
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

// HH:mm string'i alır, ISO string'e çevirir.
const timeToISO = (timeString, baseDate) => {
  if (!timeString) return null; // Kullanıcı saati silerse null yap

  try {
    const [hours, minutes] = timeString.split(":").map(Number);
    // Mevcut tarihi (eğer varsa) koru, yoksa yeni bir tarih bazı oluştur
    const date = new Date(baseDate || "2000-01-01T00:00:00Z");
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toISOString();
  } catch (e) {
    return null; // Hatalı girişte null döndür
  }
};

const ServisZamanlari = ({ bilgi, servisTipi, onBilgiChange }) => {
  if (!bilgi) return null;

  const tip = servisTipi.toLowerCase();
  const mesaiDk = bilgi.mesai_dk || 0;

  const handleTimeChange = (fieldName, newTime) => {
    const baseDate = bilgi[fieldName]; // Mevcut tarih/saat bilgisini al
    onBilgiChange({
      ...bilgi,
      [fieldName]: timeToISO(newTime, baseDate),
    });
  };

  const handleMesaiChange = (fieldName, newValue) => {
    onBilgiChange({
      ...bilgi,
      [fieldName]: parseInt(newValue) || 0,
    });
  };

  // Veri Grubu 1: SABAH
  const sabahZamanlari = [
    {
      label: "Garaj Çıkış",
      field: "garaj_cikis",
      value: formatTime(bilgi.garaj_cikis),
    },
    {
      label: "Servis Başlangıç",
      field: "basl_saati",
      value: formatTime(bilgi.basl_saati),
    },
    {
      label: "Servis Bitiş",
      field: "bitis_saati",
      value: formatTime(bilgi.bitis_saati),
    },
    {
      label: "Garaj Varış",
      field: "garaj_varis",
      value: formatTime(bilgi.garaj_varis),
    },
  ];

  // Veri Grubu 2: ARA DİNLEN
  const araDinlenZamanlari = [
    {
      label: "AD. Gar Çıkış",
      field: "ara_dinlen_gar_cikis",
      value: formatTime(bilgi.ara_dinlen_gar_cikis),
    },
    {
      label: "AD. Servis Başlangıç",
      field: "ara_dinlen_serv_basl",
      value: formatTime(bilgi.ara_dinlen_serv_basl),
    },
    {
      label: "AD. Servis Bitiş",
      field: "ara_dinlen_serv_bitis",
      value: formatTime(bilgi.ara_dinlen_serv_bitis),
    },
    {
      label: "AD. Gar Varış",
      field: "ara_dinlen_gar_varis",
      value: formatTime(bilgi.ara_dinlen_gar_varis),
    },
  ];

  // Veri Grubu 3: AKŞAM
  const aksamMesaiDk = bilgi.aksam_mesai_dk || 0;
  const aksamZamanlari = [
    {
      label: "Akşam Garaj Çıkış",
      field: "aksam_garaj_cikis",
      value: formatTime(bilgi.aksam_garaj_cikis),
    },
    {
      label: "Akşam Servis Başlangıç",
      field: "aksam_servis_basl",
      value: formatTime(bilgi.aksam_servis_basl),
    },
    {
      label: "Akşam Servis Bitiş",
      field: "aksam_servis_bitis",
      value: formatTime(bilgi.aksam_servis_bitis),
    },
    {
      label: "Akşam Garaj Varış",
      field: "aksam_garaj_varis",
      value: formatTime(bilgi.aksam_garaj_varis),
    },
  ];

  // --- Render Fonksiyonu ---
  const renderZamanBloku = (title, times, mesaiDk = 0, isAksam = false) => {
    const bgColor = isAksam ? "bg-blue-900" : "bg-cyan-500";
    return (
      <div className="bg-white rounded-lg shadow-md">
        <h4
          className={`text-lg font-semibold text-white p-4 ${bgColor} border-b rounded-t-lg flex justify-between items-center`}
        >
          <span className="underline">{title}</span>
          <Info size={18} className="text-white" />
        </h4>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {times.map((time) => (
              <div key={time.label}>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  {time.label}
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time.value} // Veri yoksa (null), value="" olur
                    placeholder="HH:mm" // ve bu placeholder görünür
                    onChange={(e) =>
                      handleTimeChange(time.field, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700"
                  />
                  <Clock
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (tip.includes("gareli") || tip.includes("normal")) {
    // KURAL 1: Normal/Gareli (FOTO1) -> SABAH bloğu + AKŞAM bloğu
    // 'useServisDetay' 'aksam_...' alanlarını 'null' olarak yüklediği için
    // Akşam bloğu boştur (HH:mm) ama gösterilir. Bu sizin isteğinizdir.
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderZamanBloku(
          `Servis Bilgileri (Mesai / ${mesaiDk} dk)`,
          sabahZamanlari,
          mesaiDk,
          false
        )}
        {renderZamanBloku(
          `Akşam Servis Bilgileri (${aksamMesaiDk} dk)`,
          aksamZamanlari,
          aksamMesaiDk,
          true
        )}
      </div>
    );
  } else if (tip.includes("ara dinlen")) {
    // KURAL 2: Ara Dinlen (İsteğiniz) -> SABAH + ARA DİNLEN alanları TEK BLOKTA
    const birlesikZamanlar = [...sabahZamanlari, ...araDinlenZamanlari];
    return renderZamanBloku(
      `Servis Bilgileri (Mesai / ${mesaiDk} dk)`,
      birlesikZamanlar, // 8 alanın tümü
      mesaiDk,
      false
    );
  } else if (tip.includes("tek şof a")) {
    // KURAL 3: Tek Şof A (FOTO2) -> Sadece AKŞAM bloğu
    return renderZamanBloku(
      `Akşam Servis Bilgileri (${aksamMesaiDk} dk)`,
      aksamZamanlari, // Bu da boş (HH:mm) görünecek
      aksamMesaiDk,
      true
    );
  } else {
    // KURAL 4: Diğer her şey (FOTO3) -> Sadece SABAH
    return renderZamanBloku(
      `Servis Bilgileri (Mesai / ${mesaiDk} dk)`,
      sabahZamanlari,
      mesaiDk,
      false
    );
  }
};

export default ServisZamanlari;
