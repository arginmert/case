import { useState, useEffect } from "react";

// --- Veri URL'leri ---
const API_URL = "http://localhost:3001";
const URLS = {
  hatlar: `${API_URL}/hatlar`,
  gunTipleri: `${API_URL}/gunTipleri`,
  servisNo: `${API_URL}/servisNo`,
  detayliBilgi: `${API_URL}/detayli_bilgi`,
  aracTipleri: `${API_URL}/aracTipleri`,
  servisTipleri: `${API_URL}/servisTipleri`,
  gar: `${API_URL}/gar`,
  garaj: `${API_URL}/garaj`,
};

// --- Zaman Formatlama Yardımcısı ---
const formatTime = (dateString, includeSeconds = false) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };
    if (includeSeconds) {
      options.second = "2-digit";
    }
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  } catch (e) {
    return "N/A";
  }
};

// ISO 8601'e geri dönüştürme
const timeToISO = (timeString, baseDate) => {
  if (!timeString) return null;
  try {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toISOString();
  } catch (e) {
    return baseDate;
  }
};

export const useServisDetay = () => {
  // Master veri listeleri
  const [hatlar, setHatlar] = useState([]);
  const [gunTipleri, setGunTipleri] = useState([]);
  const [servisNoData, setServisNoData] = useState([]);
  const [aracTipiList, setAracTipiList] = useState([]);
  const [servisTipiList, setServisTipiList] = useState([]);
  const [garList, setGarList] = useState([]);
  const [garajList, setGarajList] = useState([]);

  // Filtreler
  const [servisSiraList, setServisSiraList] = useState([]);
  const [selectedHatId, setSelectedHatId] = useState("");
  const [selectedGunTipiId, setSelectedGunTipiId] = useState("");
  const [selectedServisSira, setSelectedServisSira] = useState("");

  // Sonuçlar ve Düzenlenebilir Veri
  const [originalServisDetaylari, setOriginalServisDetaylari] = useState([]);
  const [editableBilgi, setEditableBilgi] = useState(null);
  const [editableOrerler, setEditableOrerler] = useState([]);
  const [editableNotlar, setEditableNotlar] = useState(null);

  // Durumlar
  const [isLoading, setIsLoading] = useState(false);
  const [isDetayLoading, setIsDetayLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // 1. Efekt: Sayfa yüklendiğinde TÜM master listeleri çek
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
          fetch(URLS.hatlar),
          fetch(URLS.gunTipleri),
          fetch(URLS.servisNo),
          fetch(URLS.aracTipleri),
          fetch(URLS.servisTipleri),
          fetch(URLS.gar),
          fetch(URLS.garaj),
        ]);

        if (responses.some((res) => !res.ok)) {
          throw new Error("Veri kaynaklarından biri yanıt vermedi.");
        }

        const [
          hatlarData,
          gunTipleriData,
          servisNoFullData,
          aracTipiData,
          servisTipiData,
          garData,
          garajData,
        ] = await Promise.all(responses.map((res) => res.json()));

        setHatlar(hatlarData);
        setGunTipleri(gunTipleriData.filter((g) => g.name));
        setServisNoData(servisNoFullData.filter((s) => s.hat_kodu_id));
        setAracTipiList(aracTipiData);
        setServisTipiList(servisTipiData);
        setGarList(garData);
        setGarajList(garajData);
      } catch (err) {
        setError(
          "Başlangıç verileri yüklenemedi. Lütfen json-server'ın çalıştığından emin olun."
        );
        console.error(err);
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedHatId && selectedGunTipiId) {
      const hatData = servisNoData.find(
        (item) => String(item.hat_kodu_id) === String(selectedHatId)
      );

      if (hatData && hatData.guntipi && hatData.guntipi[selectedGunTipiId]) {
        const servisler = hatData.guntipi[selectedGunTipiId];

        const gruplu = servisler.reduce((acc, servis) => {
          const sira = servis.sira_no;
          if (!acc[sira]) {
            acc[sira] = { sira_no: sira, servis_nos: [] };
          }
          acc[sira].servis_nos.push(servis.servis_no);
          return acc;
        }, {});

        const dropdownList = Object.values(gruplu)
          .map((grup) => ({
            ...grup,
            label: `${grup.sira_no} - (${grup.servis_nos.join(" / ")})`,
            value: JSON.stringify(grup.servis_nos),
          }))
          .sort((a, b) => a.sira_no - b.sira_no);

        setServisSiraList(dropdownList);

        // === YENİ EKLENEN KOD: İlk seçeneği otomatik seç ===
        if (dropdownList.length > 0) {
          setSelectedServisSira(dropdownList[0].value);
        } else {
          setSelectedServisSira("");
        }
      } else {
        setServisSiraList([]);
        setSelectedServisSira("");
      }

      setOriginalServisDetaylari([]);
      setEditableBilgi(null);
      setEditableOrerler([]);
      setEditableNotlar(null);
    } else {
      setServisSiraList([]);
      setSelectedServisSira("");
    }
  }, [selectedHatId, selectedGunTipiId, servisNoData]);

  // 3. Efekt: Servis Sıra değiştiğinde servis detay(lar)ını çek
  useEffect(() => {
    if (selectedHatId && selectedGunTipiId && selectedServisSira) {
      const fetchServisDetay = async () => {
        setIsDetayLoading(true);
        setError(null);
        setSaveStatus(null);
        setOriginalServisDetaylari([]);
        setEditableBilgi(null);
        setEditableOrerler([]);
        setEditableNotlar(null);

        try {
          const servisNoList = JSON.parse(selectedServisSira);
          const hatId = parseInt(selectedHatId);
          const gunId = parseInt(selectedGunTipiId);

          const servisQuery = servisNoList
            .map((sn) => `servis_no=${parseInt(sn)}`)
            .join("&");
          const url = `${URLS.detayliBilgi}?hat_kodu_id=${hatId}&gün_tipi_id=${gunId}&${servisQuery}`;

          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`Sunucu hatası: ${response.status}`);

          const data = await response.json();

          if (data && data.length > 0) {
            setOriginalServisDetaylari(data);

            const ilkServisBilgisi = data[0].detay?.servis_bilgiler?.[0];

            if (ilkServisBilgisi) {
              setEditableBilgi({
                ...ilkServisBilgisi,
                arac_tipi: ilkServisBilgisi.arac_tipi || null,
                servis_tipi: ilkServisBilgisi.servis_tipi || null,
                gar: ilkServisBilgisi.gar || null,
                garaj: ilkServisBilgisi.garaj || null,

                // Grup 1: Sabah
                garaj_cikis: ilkServisBilgisi.garaj_cikis || null,
                basl_saati: ilkServisBilgisi.basl_saati || null,
                bitis_saati: ilkServisBilgisi.bitis_saati || null,
                garaj_varis: ilkServisBilgisi.garaj_varis || null,

                // Grup 2: Ara Dinlen
                ara_dinlen_gar_cikis:
                  ilkServisBilgisi.ara_dinlen_gar_cikis || null,
                ara_dinlen_serv_basl:
                  ilkServisBilgisi.ara_dinlen_serv_basl || null,
                ara_dinlen_serv_bitis:
                  ilkServisBilgisi.ara_dinlen_serv_bitis || null,
                ara_dinlen_gar_varis:
                  ilkServisBilgisi.ara_dinlen_gar_varis || null,

                // Grup 3: Akşam
                aksam_garaj_cikis: ilkServisBilgisi.aksam_garaj_cikis || null,
                aksam_servis_basl: ilkServisBilgisi.aksam_servis_basl || null,
                aksam_servis_bitis: ilkServisBilgisi.aksam_servis_bitis || null,
                aksam_garaj_varis: ilkServisBilgisi.aksam_garaj_varis || null,

                aksam_mesai_dk: ilkServisBilgisi.aksam_mesai_dk || 0,
              });
            } else {
              setError(
                "Servis bilgisi yapısı bulunamadı (servis_bilgiler[0] boş)."
              );
              setEditableBilgi(null);
            }

            setEditableNotlar(data[0].detay?.hat_notlar?.not_alani || "");

            const allOrerler = data.flatMap((d) => d.detay?.orerler || []);
            allOrerler.sort((a, b) => new Date(a.saat) - new Date(b.saat));
            setEditableOrerler(allOrerler);
          } else {
            setError("Bu kriterlere uygun servis detayı bulunamadı.");
            setEditableBilgi(null);
          }
        } catch (err) {
          setError(`Servis detayı çekilirken bir hata oluştu: ${err.message}`);
          console.error("Fetch hatası:", err);
          setEditableBilgi(null);
        }
        setIsDetayLoading(false);
      };
      fetchServisDetay();
    } else {
      setOriginalServisDetaylari([]);
      setEditableBilgi(null);
      setEditableOrerler([]);
      setEditableNotlar(null);
    }
  }, [selectedHatId, selectedGunTipiId, selectedServisSira]);

  // 4. Efekt: Filtreleme kaldırıldı.
  // useEffect(() => {
  // }, [editableBilgi?.servis_tipi, originalServisDetaylari]);

  // 5. Efekt
  useEffect(() => {
    if (selectedServisSira && originalServisDetaylari.length > 0) {
      const ilkServisBilgisi =
        originalServisDetaylari[0].detay?.servis_bilgiler?.[0];

      if (ilkServisBilgisi) {
        setEditableBilgi({
          ...ilkServisBilgisi,
          arac_tipi: ilkServisBilgisi.arac_tipi || null,
          servis_tipi: ilkServisBilgisi.servis_tipi || null,
          gar: ilkServisBilgisi.gar || null,
          garaj: ilkServisBilgisi.garaj || null,
          // Sabah
          garaj_cikis: ilkServisBilgisi.garaj_cikis || null,
          basl_saati: ilkServisBilgisi.basl_saati || null,
          bitis_saati: ilkServisBilgisi.bitis_saati || null,
          garaj_varis: ilkServisBilgisi.garaj_varis || null,
          // Ara Dinlen
          ara_dinlen_gar_cikis: ilkServisBilgisi.ara_dinlen_gar_cikis || null,
          ara_dinlen_serv_basl: ilkServisBilgisi.ara_dinlen_serv_basl || null,
          ara_dinlen_serv_bitis: ilkServisBilgisi.ara_dinlen_serv_bitis || null,
          ara_dinlen_gar_varis: ilkServisBilgisi.ara_dinlen_gar_varis || null,
          // Akşam
          aksam_garaj_cikis: ilkServisBilgisi.aksam_garaj_cikis || null,
          aksam_servis_basl: ilkServisBilgisi.aksam_servis_basl || null,
          aksam_servis_bitis: ilkServisBilgisi.aksam_servis_bitis || null,
          aksam_garaj_varis: ilkServisBilgisi.aksam_garaj_varis || null,
        });
      }
    }
  }, [selectedServisSira, originalServisDetaylari]);

  // --- Filtre ve Düzenleme Fonksiyonları ---
  const handleHatChange = (e) => setSelectedHatId(e.target.value);
  const handleGunTipiChange = (e) => setSelectedGunTipiId(e.target.value);
  const handleServisSiraChange = (e) => setSelectedServisSira(e.target.value);

  const handleBilgiChange = (updatedBilgi) => {
    console.log("Bilgi güncellendi:", updatedBilgi);
    setEditableBilgi(updatedBilgi);
  };

  const handleNotlarChange = (updatedNotlar) => {
    console.log("Notlar güncellendi:", updatedNotlar);
    setEditableNotlar(updatedNotlar);
  };

  const handleOrerChange = (orerId, fieldName, newValue) => {
    setEditableOrerler((prevOrerler) =>
      prevOrerler.map((orer) => {
        if (orer.id === orerId) {
          let updatedOrer = { ...orer };
          if (fieldName === "saat") {
            updatedOrer.saat = timeToISO(newValue, orer.saat);
          } else if (fieldName === "guzergah_kodu") {
            updatedOrer.guzergah = {
              ...(orer.guzergah || {}),
              guzergah_kodu: newValue,
            };
          } else if (fieldName === "aciklama") {
            updatedOrer.aciklama = newValue;
          } else if (fieldName === "yon") {
            updatedOrer.yon = newValue;
          }
          return updatedOrer;
        }
        return orer;
      })
    );
  };

  const handleDeleteOrer = (orerId) => {
    setEditableOrerler((prev) => prev.filter((o) => o.id !== orerId));
  };

  // ========================================================
  // === GÜNCELLENMİŞ 'handleAddOrer' FONKSİYONU ===
  // ========================================================
  const handleAddOrer = (targetOrerId, type, defaultHour = 8) => {
    // 1. Tıklanan 'orer'in ana listedeki index'ini 'id' ile bul
    const targetIndex = editableOrerler.findIndex((o) => o.id === targetOrerId);

    // 2. 'baseOrer' olarak tıklananı (veya ilk/boş objeyi) al
    const baseOrer =
      (targetIndex !== -1
        ? editableOrerler[targetIndex]
        : editableOrerler[0]) || {};

    // 3. Ekleme yapılacak doğru indeksi belirle
    let insertAt;
    if (targetIndex === -1) {
      insertAt = type === "above" ? 0 : editableOrerler.length;
    } else {
      insertAt = type === "above" ? targetIndex : targetIndex + 1;
    }

    // 4. Hem GİDİŞ hem DÖNÜŞ için yeni seferler oluştur
    const newGidisOrer = {
      ...baseOrer,
      id: `temp-gidis-${Date.now()}`,
      saat: new Date("2000-01-01T00:00:00Z"),
      yon: "G",
      aciklama: "YENİ GİDİŞ SEFERİ",
      guzergah: baseOrer.guzergah || { guzergah_kodu: "" },
    };
    newGidisOrer.saat.setUTCHours(defaultHour, 0, 0, 0);
    newGidisOrer.saat = newGidisOrer.saat.toISOString();

    const newDonusOrer = {
      ...baseOrer,
      id: `temp-donus-${Date.now()}`,
      saat: new Date("2000-01-01T00:00:00Z"),
      yon: "D",
      aciklama: "YENİ DÖNÜŞ SEFERİ",
      guzergah: baseOrer.guzergah || { guzergah_kodu: "" },
    };
    newDonusOrer.saat.setUTCHours(defaultHour + 1, 0, 0, 0); // Dönüşü 1 saat sonra yap
    newDonusOrer.saat = newDonusOrer.saat.toISOString();

    // 5. State'i güncelle - hem gidiş hem dönüşü aynı anda ekle
    setEditableOrerler((prev) => {
      const newArray = [...prev];

      // Gidiş ve dönüşü sırayla ekle
      newArray.splice(insertAt, 0, newGidisOrer);
      newArray.splice(insertAt + 1, 0, newDonusOrer);

      return newArray;
    });
  };

  const handleSave = async () => {
    if (!originalServisDetaylari.length) {
      setSaveStatus({
        type: "error",
        message: "Kaydedilecek veri bulunamadı.",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const savePromises = originalServisDetaylari.map((originalDetay) => {
        const payload = {
          ...originalDetay,
          detay: {
            ...originalDetay.detay,
            servis_bilgiler: [editableBilgi],
            hat_notlar: {
              ...(originalDetay.detay?.hat_notlar || {}),
              not_alani: editableNotlar,
            },
            orerler: editableOrerler.filter(
              (o) => o.servis?.servis_no === originalDetay.servis_no
            ),
          },
        };

        payload.detay.orerler = payload.detay.orerler.map((o) => {
          if (String(o.id).startsWith("temp-")) {
            const { id, ...rest } = o;
            return rest;
          }
          return o;
        });

        console.log("Kaydedilen payload:", payload);

        return fetch(`${URLS.detayliBilgi}/${originalDetay.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      });

      const responses = await Promise.all(savePromises);

      if (responses.some((res) => !res.ok)) {
        throw new Error("Bazı servisler güncellenirken hata oluştu.");
      }

      setSaveStatus({
        type: "success",
        message: "Tüm değişiklikler başarıyla kaydedildi!",
      });
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: `Kaydetme hatası: ${err.message}`,
      });
    }
    setIsSaving(false);
  };

  return {
    // Durumlar
    isLoading,
    isDetayLoading,
    isSaving,
    error,
    saveStatus,

    // Filtreler
    hatlar,
    gunTipleri,
    servisSiraList,
    selectedHatId,
    selectedGunTipiId,
    selectedServisSira,
    handleHatChange,
    handleGunTipiChange,
    handleServisSiraChange,

    // Listeler
    aracTipiList,
    servisTipiList,
    garList,
    garajList,

    // Veriler
    originalServisDetaylari,
    editableBilgi,
    editableOrerler,
    editableNotlar,

    // Fonksiyonlar
    handleBilgiChange,
    handleNotlarChange,
    handleOrerChange,
    handleDeleteOrer,
    handleAddOrer,
    handleSave,
  };
};
