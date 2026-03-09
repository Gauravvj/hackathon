import { useState } from 'react';

/**
 * VoiceConfirmation component.
 * Uses the Web Speech Recognition API to detect when a patient says
 * "I took my medicine" (or similar phrases).
 * Falls back gracefully if the browser doesn't support Speech Recognition.
 */
export default function VoiceConfirmation({ onConfirm }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');

  const startListening = () => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('❌ Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatus('🎙️ Listening... Say "I took my medicine"');
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      setTranscript(speech);

      // Check if the patient confirmed taking medicine
      if (speech.includes('took') && speech.includes('medicine')) {
        setStatus('✅ Voice confirmed! Medicine intake recorded.');
        onConfirm?.('voice');
      } else if (speech.includes('yes') || speech.includes('taken') || speech.includes('done')) {
        setStatus('✅ Confirmation detected! Medicine intake recorded.');
        onConfirm?.('voice');
      } else {
        setStatus('⚠️ Could not understand. Please try again.');
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      setStatus(`❌ Error: ${event.error}`);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🎤</span>
        <h3 className="text-sm font-semibold text-slate-200">Voice Confirmation</h3>
      </div>

      <button
        onClick={startListening}
        disabled={listening}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          listening
            ? 'bg-red-500/20 text-red-300 border border-red-500/30 cursor-not-allowed reminder-pulse'
            : 'btn-primary'
        }`}
      >
        {listening ? '🎙️ Listening...' : '🎤 Say "I took my medicine"'}
      </button>

      {transcript && (
        <p className="text-xs text-slate-400">
          Heard: <span className="text-slate-200 italic">"{transcript}"</span>
        </p>
      )}

      {status && (
        <p className={`text-xs font-medium ${
          status.includes('✅') ? 'text-green-400' :
          status.includes('❌') ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {status}
        </p>
      )}
    </div>
  );
}
