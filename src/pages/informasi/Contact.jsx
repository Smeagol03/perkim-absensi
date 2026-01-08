import React from "react";

const Contact = () => {
  return (
    <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hubungi Kami</h2>
        <p className="text-slate-400">
          Silakan hubungi kami untuk informasi lebih lanjut
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            icon: "📍",
            title: "Alamat",
            value: "Jl. Prof. M. Yamin, SH No. 2, Selong, Lombok Timur",
          },
          {
            icon: "📞",
            title: "Telepon",
            value: "(0376) 21234",
          },
          {
            icon: "📧",
            title: "Email",
            value: "perkim@lomboktimur.go.id",
          },
          {
            icon: "🕐",
            title: "Jam Kerja",
            value: "Senin - Jumat, 07:30 - 16:00 WITA",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <h4 className="font-semibold text-white/90 text-sm mb-1">
              {item.title}
            </h4>
            <p className="text-slate-300 text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 overflow-hidden">
        <div className="aspect-16/6 bg-slate-700/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl block mb-2">🗺️</span>
            <p className="text-slate-400 text-sm">Peta Lokasi Kantor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
