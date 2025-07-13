'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ArrowLeft, 
  Flashlight, 
  FlashlightOff,
  RotateCcw,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  Shield,
  QrCode,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePaymentStore } from '@/store/payment';

type ScanResult = {
  type: 'payment_request' | 'user_profile' | 'contact';
  data: {
    userId?: string;
    userName?: string;
    amount?: number;
    currency?: string;
    description?: string;
    expiresAt?: Date;
    email?: string;
  };
};

export default function QRScanPage() {
  const { user, state: authState } = useAuthStore();
  const { parseQRCode, sendMoney, isLoading, clearError } = usePaymentStore();
  const router = useRouter();
  
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== 'authenticated' || !user) {
      router.push('/auth/login');
    }
  }, [authState, user, router]);

  // Request camera permission and start scanning
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        setCameraStream(stream);
        setHasPermission(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setHasPermission(false);
        setError('카메라 접근 권한이 필요합니다.');
      }
    };

    if (authState === 'authenticated') {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [authState]);

  // Mock QR code scanning (in real app, would use a QR code library)
  const scanQRCode = () => {
    if (!isScanning) return;

    // Mock scan results for demo
    const mockResults: ScanResult[] = [
      {
        type: 'payment_request',
        data: {
          userId: 'alice_123',
          userName: 'Alice Johnson',
          amount: 25.00,
          currency: 'USD',
          description: 'Coffee & Lunch',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      },
      {
        type: 'user_profile',
        data: {
          userId: 'bob_456',
          userName: 'Bob Smith',
          email: 'bob@example.com'
        }
      }
    ];

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setScanResult(randomResult);
    setIsScanning(false);
  };

  // Simulate scanning every 3 seconds for demo
  useEffect(() => {
    if (isScanning && hasPermission) {
      const interval = setInterval(scanQRCode, 3000);
      return () => clearInterval(interval);
    }
  }, [isScanning, hasPermission]);

  const toggleFlash = async () => {
    if (cameraStream) {
      try {
        const track = cameraStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          });
          setFlashEnabled(!flashEnabled);
        }
      } catch (err) {
        console.error('Flash not supported:', err);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would decode the QR code from the image
      setShowProcessing(true);
      setTimeout(() => {
        setShowProcessing(false);
        scanQRCode(); // Mock result
      }, 2000);
    }
  };

  const restartScan = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
    clearError();
  };

  const handlePaymentRequest = async () => {
    if (!scanResult || scanResult.type !== 'payment_request') return;

    try {
      setShowProcessing(true);
      
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowProcessing(false);
      router.push('/transactions?success=payment_sent');
    } catch (error) {
      setShowProcessing(false);
      setError('결제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleAddContact = () => {
    if (!scanResult || scanResult.type !== 'user_profile') return;
    
    // Navigate to send money page with pre-filled user info
    router.push(`/send?contact=${encodeURIComponent(JSON.stringify(scanResult.data))}`);
  };

  if (authState !== 'authenticated' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-semibold text-white">
            QR 코드 스캔
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFlash}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {flashEnabled ? (
                <FlashlightOff className="w-6 h-6" />
              ) : (
                <Flashlight className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Upload className="w-6 h-6" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative flex-1">
        {hasPermission === null ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>카메라 권한을 확인하는 중...</p>
            </div>
          </div>
        ) : hasPermission === false ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center text-white p-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold mb-4">카메라 접근 권한 필요</h2>
              <p className="text-gray-300 mb-6">
                QR 코드를 스캔하려면 카메라 권한이 필요합니다.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-screen object-cover"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning Frame */}
                <div className="relative w-64 h-64 border-2 border-white rounded-xl">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                  
                  {/* Scanning Line Animation */}
                  {isScanning && (
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-lg shadow-blue-400/50"
                    />
                  )}
                </div>
                
                {/* Instructions */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                    QR 코드를 프레임 안에 맞춰주세요
                  </p>
                </div>
              </div>
            </div>

            {/* Overlay Dark Areas */}
            <div className="absolute inset-0 bg-black/60">
              <div className="flex items-center justify-center h-full">
                <div className="w-64 h-64 bg-transparent border border-transparent rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Processing Modal */}
      <AnimatePresence>
        {showProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center max-w-sm mx-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                처리 중...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                QR 코드를 분석하고 있습니다
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Result Modal */}
      <AnimatePresence>
        {scanResult && !showProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-6 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                스캔 완료
              </h3>
              <button
                onClick={restartScan}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {scanResult.type === 'payment_request' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      결제 요청
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {scanResult.data.userName}님의 요청
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">금액</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${scanResult.data.amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">설명</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {scanResult.data.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">만료일</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {scanResult.data.expiresAt?.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={restartScan}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 rounded-lg transition-colors"
                  >
                    다시 스캔
                  </button>
                  <button
                    onClick={handlePaymentRequest}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    결제하기
                  </button>
                </div>
              </div>
            )}

            {scanResult.type === 'user_profile' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      사용자 프로필
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      새로운 연락처
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">이름</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {scanResult.data.userName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">이메일</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {scanResult.data.email}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={restartScan}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 rounded-lg transition-colors"
                  >
                    다시 스캔
                  </button>
                  <button
                    onClick={handleAddContact}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    송금하기
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50 flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-3 hover:bg-red-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}