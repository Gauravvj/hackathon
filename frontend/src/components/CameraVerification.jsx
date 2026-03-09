import { useState, useRef } from 'react';

/**
 * CameraVerification component.
 * Lets the patient show their pill to the camera.
 * Captures a frame and simulates AI verification.
 * (In production, you'd send the image to the AI microservice.)
 */
export default function CameraVerification({ onVerified }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setResult(null);
    } catch (err) {
      setResult({ success: false, message: '❌ Could not access camera. Please allow camera permissions.' });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureAndVerify = () => {
    setVerifying(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      // Simulated verification result (always succeeds for demo)
      const verified = Math.random() > 0.1; // 90% success rate simulation
      
      if (verified) {
        setResult({ success: true, message: '✅ Pill verified successfully! Match confirmed.' });
        onVerified?.('camera');
      } else {
        setResult({ success: false, message: '⚠️ Could not verify pill. Please try again or confirm manually.' });
      }
      
      setVerifying(false);
      stopCamera();
    }, 2000);
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">📷</span>
        <h3 className="text-sm font-semibold text-slate-200">Camera Pill Verification</h3>
      </div>

      {!cameraActive ? (
        <button onClick={startCamera} className="btn-outline w-full text-sm py-3">
          📸 Open Camera to Verify Pill
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {verifying && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl animate-spin mb-2">⚙️</div>
                  <p className="text-sm text-slate-300">Analyzing pill...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={captureAndVerify}
              disabled={verifying}
              className="btn-success flex-1 text-sm py-2"
            >
              {verifying ? 'Verifying...' : '📸 Capture & Verify'}
            </button>
            <button
              onClick={stopCamera}
              className="btn-danger text-sm py-2 px-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <p className={`text-xs font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
