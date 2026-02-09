export const ScannerOverlay = ({ isScanning }: { isScanning: boolean }) => {
  return (
    <div className="absolute inset-0 border-40 border-black/50 pointer-events-none z-10">
      <div className="w-full h-full border-2 border-blue-500/50 relative">
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />

        {/* Scanning Line Animation */}
        {isScanning && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
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
