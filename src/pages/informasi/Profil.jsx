import VisiMisi from "./VisiMisi";
import TugasPokok from "./TugasPokok";
import Contact from "./Contact";

const Profil = () => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-sm font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Profil Instansi
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Dinas Perumahan dan <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600">
            Kawasan Permukiman
          </span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          Kabupaten Lombok Timur, Nusa Tenggara Barat
        </p>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Logo/Icon */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200/50 shrink-0">
            <span className="text-5xl sm:text-6xl">🏛️</span>
          </div>

          {/* Description */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              PERKIM KABUPATEN LOMBOK TIMUR
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Dinas Perumahan dan Kawasan Permukiman (Perkim) Kabupaten Lombok
              Timur adalah instansi pemerintah yang bertugas melaksanakan urusan
              pemerintahan di bidang perumahan, permukiman, pertanahan, dan tata
              ruang. Kami berkomitmen untuk mewujudkan hunian yang layak,
              tertata, dan berkelanjutan bagi seluruh masyarakat Lombok Timur.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100">
                🏠 Perumahan
              </span>
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">
                🌳 Permukiman
              </span>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border border-purple-100">
                📍 Pertanahan
              </span>
              <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-medium border border-orange-100">
                🗺️ Tata Ruang
              </span>
            </div>
          </div>
        </div>
      </div>

      <VisiMisi />
      <TugasPokok />
      <Contact />
    </div>
  );
};

export default Profil;
