export const ScannerOverlay = ({
  isScanning,
  colorMode = 'EVENTS',
}: {
  isScanning: boolean
  colorMode?: 'EVENTS' | 'MOVIES'
}) => {
  const colorClasses =
    colorMode === 'EVENTS'
      ? {
          border: 'border-blue-500',
          bg: 'bg-blue-500',
          shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.8)]',
        }
      : {
          border: 'border-yellow-500',
          bg: 'bg-yellow-500',
          shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.8)]',
        }

  return (
    <div className="absolute inset-0 border-40 border-black/50 pointer-events-none z-10">
      <div
        className={`w-full h-full border-2 border-dashed ${colorClasses.border} border-opacity-30 relative`}
      >
        {/* Corner Markers */}
        <div
          className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${colorClasses.border}`}
        />
        <div
          className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${colorClasses.border}`}
        />
        <div
          className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${colorClasses.border}`}
        />
        <div
          className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${colorClasses.border}`}
        />

        {/* Scanning Line Animation */}
        {isScanning && (
          <div
            className={`absolute top-0 left-0 w-full h-1 ${colorClasses.bg} ${colorClasses.shadow} animate-[scan_2s_ease-in-out_infinite]`}
          />
        )}
      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
