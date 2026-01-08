import Nav from "./component/Nav";
import Profil from "./informasi/Profil";

const Informasi = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700 pb-20">
        <Nav />
        <section className="relative overflow-hidden pt-8 sm:pt-16 pb-16 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Profil />
          </div>
        </section>
      </div>
    </>
  );
};

export default Informasi;
