import React from "react";

const TugasPokok = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Tugas Pokok & Fungsi
        </h2>
        <p className="text-slate-500">
          Bidang kerja utama Dinas Perkim Lombok Timur
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            icon: "🏗️",
            title: "Pembangunan Perumahan",
            desc: "Program pembangunan rumah layak huni",
            color: "blue",
          },
          {
            icon: "🛤️",
            title: "Infrastruktur Permukiman",
            desc: "Drainase, jalan lingkungan, sanitasi",
            color: "green",
          },
          {
            icon: "📋",
            title: "Administrasi Pertanahan",
            desc: "Pengelolaan aset dan sertifikasi",
            color: "purple",
          },
          {
            icon: "🗺️",
            title: "Perencanaan Tata Ruang",
            desc: "RTRW dan penataan kawasan",
            color: "orange",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-${item.color}-50/50 border border-${item.color}-100 rounded-2xl p-5 text-center hover:scale-105 transition-transform cursor-default`}
          >
            <div
              className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-3xl">{item.icon}</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
            <p className="text-slate-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TugasPokok;
