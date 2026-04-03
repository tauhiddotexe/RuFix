import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { CubeColor, FaceName } from '@/types/cube';
import { cn } from '@/lib/utils';
import { ColorCalibration, HsvColor, detectCubeColorsFromImageData } from '@/lib/colorDetection';

type CubeSize = 2 | 3 | 4;

interface CameraScannerProps {
  onScanComplete: (cube: Record<string, CubeColor[]>) => void;
  onClose: () => void;
  cubeSize?: CubeSize;
}

const FACE_ORDER: FaceName[] = ['U', 'F', 'R', 'B', 'L', 'D'];
const FACE_NAMES: Record<FaceName, string> = {
  U: 'Top (White center)',
  D: 'Bottom (Yellow center)',
  F: 'Front (Red center)',
  B: 'Back (Orange center)',
  L: 'Left (Green center)',
  R: 'Right (Blue center)',
};

const FACE_CENTER_COLORS: Record<FaceName, CubeColor> = {
  U: 'W',
  D: 'Y',
  F: 'R',
  B: 'O',
  L: 'G',
  R: 'B',
};

export const CameraScanner = ({ onScanComplete, onClose, cubeSize = 3 }: CameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [scannedFaces, setScannedFaces] = useState<Record<string, CubeColor[]>>({});
  const [currentScan, setCurrentScan] = useState<CubeColor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [calibration, setCalibration] = useState<ColorCalibration>({});
  const calibrationCandidateRef = useRef<{ color: CubeColor; hsv: HsvColor } | null>(null);

  const cellCount = cubeSize * cubeSize;
  const currentFace = FACE_ORDER[currentFaceIndex];

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const streamRef = useRef<MediaStream | null>(null);

  // Keep streamRef in sync
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const scanCurrentFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // For 3x3 faces, the fixed center sticker lets us calibrate the HSV ranges
    // without changing the existing scan flow or adding new UI.
    const result = detectCubeColorsFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), cubeSize, {
      calibration,
      centerHintColor: cubeSize === 3 ? FACE_CENTER_COLORS[currentFace] : undefined,
    });

    calibrationCandidateRef.current = result.calibrationCandidate ?? null;
    setCurrentScan(result.colors);
  }, [calibration, cubeSize, currentFace]);

  useEffect(() => {
    if (!stream) return;
    const interval = setInterval(() => {
      if (isScanning) scanCurrentFrame();
    }, 200);
    return () => clearInterval(interval);
  }, [stream, isScanning, scanCurrentFrame]);

  const confirmScan = () => {
    if (!currentScan) return;

    const calibrationCandidate = calibrationCandidateRef.current;
    if (calibrationCandidate?.hsv) {
      setCalibration(prev => ({
        ...prev,
        [calibrationCandidate.color]: calibrationCandidate.hsv,
      }));
    }
    
    const newScanned = { ...scannedFaces, [currentFace]: currentScan };
    setScannedFaces(newScanned);

    if (currentFaceIndex < FACE_ORDER.length - 1) {
      setCurrentFaceIndex(prev => prev + 1);
      setCurrentScan(null);
      setIsScanning(false);
      calibrationCandidateRef.current = null;
    } else {
      const defaultFace = (color: CubeColor) => Array(cellCount).fill(color) as CubeColor[];
      const completeCube: Record<string, CubeColor[]> = {
        U: newScanned.U || defaultFace('W'),
        D: newScanned.D || defaultFace('Y'),
        F: newScanned.F || defaultFace('R'),
        B: newScanned.B || defaultFace('O'),
        L: newScanned.L || defaultFace('G'),
        R: newScanned.R || defaultFace('B'),
      };
      
      stopCamera();
      onScanComplete(completeCube);
    }
  };

  const retakeScan = () => {
    setCurrentScan(null);
    setIsScanning(false);
    calibrationCandidateRef.current = null;
  };

  const COLOR_DISPLAY: Record<CubeColor, string> = {
    W: 'bg-white',
    Y: 'bg-yellow-400',
    R: 'bg-red-600',
    O: 'bg-orange-500',
    B: 'bg-blue-600',
    G: 'bg-green-600',
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Scan {cubeSize}×{cubeSize} Cube - {FACE_NAMES[currentFace]}</h2>
        <button onClick={() => { stopCamera(); onClose(); }} className="p-2 hover:bg-muted rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        {error ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-destructive">{error}</p>
            <button onClick={startCamera} className="action-btn-secondary">Try Again</button>
          </div>
        ) : (
          <>
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="rounded-xl max-w-full max-h-[50vh]" />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="w-1/2 aspect-square gap-1 border-2 border-primary rounded-lg grid"
                  style={{ gridTemplateColumns: `repeat(${cubeSize}, 1fr)` }}
                >
                  {Array.from({ length: cellCount }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'border border-primary/50 rounded',
                        currentScan && COLOR_DISPLAY[currentScan[i]]
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {currentScan && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">Detected colors:</p>
                <div className="gap-1 grid" style={{ gridTemplateColumns: `repeat(${cubeSize}, 1fr)` }}>
                  {currentScan.map((color, i) => (
                    <div key={i} className={cn('w-10 h-10 rounded border-2 border-border', COLOR_DISPLAY[color])} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {FACE_ORDER.map((face, i) => (
                <div
                  key={face}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                    i < currentFaceIndex ? 'bg-primary text-primary-foreground'
                      : i === currentFaceIndex ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {face}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {!isScanning && !currentScan && (
                <button onClick={() => setIsScanning(true)} className="action-btn-primary flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Start Scanning
                </button>
              )}
              {isScanning && !currentScan && (
                <button onClick={scanCurrentFrame} className="action-btn-primary flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Capture
                </button>
              )}
              {currentScan && (
                <>
                  <button onClick={retakeScan} className="action-btn-secondary flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                  <button onClick={confirmScan} className="action-btn-primary flex items-center gap-2">
                    <Check className="w-4 h-4" /> {currentFaceIndex < FACE_ORDER.length - 1 ? 'Next Face' : 'Finish'}
                  </button>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center max-w-md">
              Hold your cube so the {currentFace} face fills the grid overlay, then capture.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
