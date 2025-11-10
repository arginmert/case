import React from "react";
import ServisFiltreleri from "../components/filters/ServisFiltreleri";
import ServisBilgileriEditor from "../components/filters/ServisBilgileriEditor";
import ServisZamanlari from "../components/details/ServisZamanlari";
import Seferler from "../components/details/Seferler";
import DetayDurumGostergesi from "../components/ui/DetayDurumGostergesi";
import SaveController from "../components/ui/SaveController";
import { useServisDetay } from "../components/hooks/useServisDetay";
import PageLayout from "../components/PageLayout";
import Button from "../components/ui/Button";

export default function ServisDetayPage() {
  const servisDetay = useServisDetay();

  // ID'leri doğru şekilde al (Değişiklik yok)
  const getIds = () => {
    if (servisDetay.isDetayLoading) {
      return {
        servisBilgiIds: "",
        servisIds: "",
      };
    }
    const servisBilgiId = servisDetay.editableBilgi?.id || "";
    let servisIds = "";
    if (servisDetay.editableOrerler && servisDetay.editableOrerler.length > 0) {
      const uniqueServisIds = [
        ...new Set(
          servisDetay.editableOrerler
            .map((orer) => orer.servis?.id)
            .filter((id) => id !== undefined && id !== null)
        ),
      ];
      servisIds = uniqueServisIds.join(", ");
    } else if (
      servisDetay.originalServisDetaylari &&
      servisDetay.originalServisDetaylari.length > 0
    ) {
      servisIds = servisDetay.originalServisDetaylari
        .map((item) => item.id)
        .filter((id) => id !== undefined && id !== null)
        .join(", ");
    }
    return {
      servisBilgiIds: servisBilgiId,
      servisIds: servisIds,
    };
  };

  const ids = getIds();

  // 17:00 kuralı (Değişiklik yok)
  const servisTipi =
    servisDetay.editableBilgi?.servis_tipi?.servis_tipi?.toLowerCase() ||
    "diğer";
  const allOrerler = servisDetay.editableOrerler;

  const sabahOrerler = React.useMemo(
    () =>
      allOrerler.filter((o) => {
        try {
          return new Date(o.saat).getUTCHours() < 17;
        } catch (e) {
          return false;
        }
      }),
    [allOrerler]
  );

  const aksamOrerler = React.useMemo(
    () =>
      allOrerler.filter((o) => {
        try {
          return new Date(o.saat).getUTCHours() >= 17;
        } catch (e) {
          return false;
        }
      }),
    [allOrerler]
  );

  // ========================================================
  // === DÜZELTME BURADA: YARDIMCI FONKSİYONLAR ===
  // ========================================================

  // Sabah tablosuna ekleme yaparken, varsayılan saati 08:00 yap
  const handleAddSabahOrer = (targetOrerId, type) => {
    servisDetay.handleAddOrer(targetOrerId, type, 8); // 8 = 08:00
  };

  // Akşam tablosuna ekleme yaparken, varsayılan saati 18:00 yap
  const handleAddAksamOrer = (targetOrerId, type) => {
    servisDetay.handleAddOrer(targetOrerId, type, 18); // 18 = 18:00
  };

  return (
    <PageLayout>
      <div className="min-h-full bg-gray-50 font-sans p-4">
        {/* Filtreler ve Editor Alanı (Değişiklik yok) */}
        <div className="bg-white rounded-lg mb-4 p-4">
          <div className="flex justify-between items-center mb-4 bg-gray-200 border-b">
            <div className="flex gap-4 p-2">
              {ids.servisBilgiIds !== "" && (
                <p className="text-sm font-semibold text-gray-400">
                  Servis Bilgi Ids: {ids.servisBilgiIds}
                </p>
              )}
              {ids.servisIds !== "" && (
                <p className="text-sm font-semibold text-gray-400">
                  | Servis Ids: {ids.servisIds}
                </p>
              )}
              {ids.servisBilgiIds === "" && ids.servisIds === "" && (
                <p className="text-sm text-gray-400">ID bilgisi yok</p>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <ServisFiltreleri {...servisDetay} />
              <ServisBilgileriEditor
                bilgi={servisDetay.editableBilgi}
                onBilgiChange={servisDetay.handleBilgiChange}
                aracTipiList={servisDetay.aracTipiList}
                servisTipiList={servisDetay.servisTipiList}
                garList={servisDetay.garList}
                garajList={servisDetay.garajList}
                isDisabled={
                  !servisDetay.editableBilgi || servisDetay.isDetayLoading
                }
              />
            </div>
            <Button
              text={"Görev Kağıdı"}
              color="gray"
              className="text-sm max-sm:hidden"
            ></Button>
          </div>
        </div>

        {/* Durum Göstergesi (Değişiklik yok) */}
        <DetayDurumGostergesi
          isDetayLoading={servisDetay.isDetayLoading}
          error={servisDetay.error}
          editableBilgi={servisDetay.editableBilgi}
          selectedServisSira={servisDetay.selectedServisSira}
        />

        {/* DİNAMİK İÇERİK ALANI */}
        {servisDetay.editableBilgi && (
          <div className="space-y-4">
            <ServisZamanlari
              bilgi={servisDetay.editableBilgi}
              servisTipi={
                servisDetay.editableBilgi.servis_tipi?.servis_tipi || "Diğer"
              }
              onBilgiChange={servisDetay.handleBilgiChange}
            />

            {/* ======================================================== */}
            {/* === DÜZELTME BURADA: Doğru fonksiyonlar bağlandı === */}
            {/* ======================================================== */}

            {/* Kural: Sabah + Akşam (Normal, Gareli, Ara Dinlen) */}
            {(servisTipi.includes("gareli") ||
              servisTipi.includes("normal") ||
              servisTipi.includes("ara dinlen")) && (
              <>
                <Seferler
                  title="Sefer Saatleri"
                  orerler={sabahOrerler}
                  onOrerChange={servisDetay.handleOrerChange}
                  onAddOrer={handleAddSabahOrer}
                  onDeleteOrer={servisDetay.handleDeleteOrer}
                />
                <Seferler
                  title="Akşam Sefer Saatleri"
                  orerler={aksamOrerler}
                  onOrerChange={servisDetay.handleOrerChange}
                  onAddOrer={handleAddAksamOrer}
                  onDeleteOrer={servisDetay.handleDeleteOrer}
                />
              </>
            )}

            {/* Kural: Sadece Akşam (Tek Şof A) */}
            {servisTipi.includes("tek şof a") && (
              <Seferler
                title="Akşam Sefer Saatleri"
                orerler={aksamOrerler}
                onOrerChange={servisDetay.handleOrerChange}
                onAddOrer={handleAddAksamOrer}
                onDeleteOrer={servisDetay.handleDeleteOrer}
              />
            )}

            {/* Kural: Sadece Sabah (Diğer tüm tipler) */}
            {!servisTipi.includes("gareli") &&
              !servisTipi.includes("normal") &&
              !servisTipi.includes("ara dinlen") &&
              !servisTipi.includes("tek şof a") && (
                <Seferler
                  title="Sefer Saatleri"
                  orerler={sabahOrerler}
                  onOrerChange={servisDetay.handleOrerChange}
                  onAddOrer={handleAddSabahOrer}
                  onDeleteOrer={servisDetay.handleDeleteOrer}
                />
              )}
          </div>
        )}

        {/* Kaydetme Alanı (Değişiklik yok) */}
        <SaveController
          onSave={servisDetay.handleSave}
          isSaving={servisDetay.isSaving}
          saveStatus={servisDetay.saveStatus}
        />
      </div>
    </PageLayout>
  );
}
