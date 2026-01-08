import React from "react";

const EmptyState = ({
  icon = "📭",
  title = "Data tidak ditemukan",
  description = "Tidak ada data yang tersedia saat ini",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-5xl">{icon}</span>
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-slate-200 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-slate-500 text-center max-w-sm mb-6">{description}</p>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
