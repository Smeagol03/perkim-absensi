import React from "react";

const VisiMisi = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Visi */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">👁️</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">Visi</h3>
        </div>
        <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
          "Terwujudnya Perumahan dan Kawasan Permukiman yang Layak Huni,
          Tertata, Berkelanjutan, dan Berwawasan Lingkungan untuk Kesejahteraan
          Masyarakat Lombok Timur"
        </p>
      </div>

      {/* Misi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Misi</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Meningkatkan kualitas perumahan dan permukiman layak huni",
            "Mengembangkan infrastruktur kawasan permukiman yang terintegrasi",
            "Menyelenggarakan penataan ruang yang berkelanjutan",
            "Meningkatkan pelayanan publik yang transparan dan akuntabel",
          ].map((misi, index) => (
            <li
              key={index}
              className="flex gap-3 text-slate-600 text-sm sm:text-base"
            >
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold">
                {index + 1}
              </span>
              {misi}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VisiMisi;
