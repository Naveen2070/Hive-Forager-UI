import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ScannerControlsProps {
  onReset: () => void
  isReady: boolean
}

export const ScannerControls = ({ onReset, isReady }: ScannerControlsProps) => {
  return (
    <Card className="w-full p-4 bg-slate-900 border-slate-800">
      <div className="flex items-center gap-4">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${isReady ? 'bg-blue-900/20' : 'bg-slate-800'}`}
        >
          <Camera
            className={`h-5 w-5 ${isReady ? 'text-blue-500' : 'text-slate-400'}`}
          />
        </div>
        <div>
          <div className="text-sm font-medium text-white">
            {isReady ? 'Ready to scan' : 'Processing...'}
          </div>
          <div className="text-xs text-slate-500">Ensure good lighting</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-slate-700 hover:bg-slate-800"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </Card>
  )
}
