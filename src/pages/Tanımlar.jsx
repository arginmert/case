import React from "react";
import TanimTablosu from "../components/TanimTablosu";
import PageLayout from "../components/PageLayout";

const Tanımlar = () => {
  return (
    <div>
      <PageLayout title={"Genel Fiili Orer"}>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">
          <TanimTablosu
            title="Tanımlı Servis Tipleri"
            apiUrl="http://localhost:3001/servisTipleri"
            sutunAdi="Servis Tipi"
            sutunAdi2="Operatör Tipi"
          />
          <TanimTablosu
            title="Tanımlı Araç Tipleri"
            apiUrl="http://localhost:3001/aracTipleri"
            sutunAdi="Araç Tipi"
            sutunAdi2="Operatör Tipi"
          />
          <TanimTablosu
            title="Tanımlı Gün Tipleri"
            apiUrl="http://localhost:3001/gunTipleri"
            sutunAdi="Gün Tipi"
          />
        </div>
      </PageLayout>
    </div>
  );
};

export default Tanımlar;
