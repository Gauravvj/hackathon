
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

/**
 * CognitiveGamePage — Pattern Memory and Number Recall mini-games.
 * Results are saved to the database for caregiver monitoring.
 */
export default function CognitiveGamePage() {
  const { user } = useAuth();
  const [activeGame, setActiveGame] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get(`/cognitive/${user._id}`).then(res => setResults(res.data)).catch(() => {});
  }, [user]);

  const saveResult = async (gameType, score) => {
    try {
      await api.post('/cognitive', { patientId: user._id, gameType, score, maxScore: 100 });
      const res = await api.get(`/cognitive/${user._id}`);
      setResults(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-12 mt-7 animate-fade-in">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold p-6 text-slate-100">🧠 Brain Games</h1>
          <p className="text-slate-400 text-base mt-5">
            Keep your mind sharp with memory exercises
          </p>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">

            {/* Pattern Memory Card */}
            <div
              className="glass-card p-10 text-center cursor-pointer hover:scale-[1.03] transition-all duration-300"
              onClick={() => setActiveGame('pattern')}
            >
              <span className="text-6xl block mb-5">🎨</span>

              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Pattern Memory
              </h2>

              <p className="text-sm text-slate-400">
                Remember and repeat the color pattern
              </p>

              <button className="btn-primary mt-6 px-6 py-3">
                ▶ Play
              </button>
            </div>

            {/* Number Recall Card */}
            <div
              className="glass-card p-10 text-center cursor-pointer hover:scale-[1.03] transition-all duration-300"
              onClick={() => setActiveGame('number')}
            >
              <span className="text-6xl block mb-5">🔢</span>

              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Number Recall
              </h2>

              <p className="text-sm text-slate-400">
                Remember the sequence of numbers
              </p>

              <button className="btn-primary mt-6 px-6 py-3">
                ▶ Play
              </button>
            </div>

          </div>
        ) : activeGame === 'pattern' ? (
          <PatternGame
            onFinish={(s) => {
              saveResult('pattern_memory', s);
              setActiveGame(null);
            }}
            onBack={() => setActiveGame(null)}
          />
        ) : (
          <NumberGame
            onFinish={(s) => {
              saveResult('number_recall', s);
              setActiveGame(null);
            }}
            onBack={() => setActiveGame(null)}
          />
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-6">
              📊 Recent Results
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {results.slice(0, 8).map(r => (
                <div key={r._id} className="glass-card p-6 text-center">

                  <span className="text-4xl">
                    {r.gameType === 'pattern_memory' ? '🎨' : '🔢'}
                  </span>

                  <p className="text-3xl font-bold text-indigo-400 mt-2">
                    {r.score}%
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(r.playedAt).toLocaleDateString()}
                  </p>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

/* ---------------- Pattern Memory Game ---------------- */

function PatternGame({ onFinish, onBack }) {
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [showing, setShowing] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startRound = useCallback(() => {
    const newSeq = Array.from({ length: round + 2 }, () => Math.floor(Math.random() * colors.length));
    setSequence(newSeq);
    setPlayerSeq([]);
    setShowing(true);

    newSeq.forEach((ci, i) => {
      setTimeout(() => setActiveColor(ci), i * 700);
      setTimeout(() => setActiveColor(null), i * 700 + 400);
    });

    setTimeout(() => setShowing(false), newSeq.length * 700 + 200);
  }, [round]);

  useEffect(() => { startRound(); }, [round]);

  const handleClick = (ci) => {
    if (showing || gameOver) return;

    const newPlayerSeq = [...playerSeq, ci];
    setPlayerSeq(newPlayerSeq);

    setActiveColor(ci);
    setTimeout(() => setActiveColor(null), 200);

    const idx = newPlayerSeq.length - 1;

    if (newPlayerSeq[idx] !== sequence[idx]) {
      const finalScore = Math.round(((round - 1) / 5) * 100);
      setScore(finalScore);
      setGameOver(true);
      onFinish(finalScore);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      if (round >= 5) {
        setScore(100);
        setGameOver(true);
        onFinish(100);
      } else {
        setTimeout(() => setRound(r => r + 1), 500);
      }
    }
  };

  return (
    <div className="glass-card p-10 space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          🎨 Pattern Memory — Round {round}/5
        </h2>

        <button onClick={onBack} className="btn-outline text-xs py-2 px-4">
          ← Back
        </button>
      </div>

      {showing && (
        <p className="text-center text-yellow-400 font-medium">
          Watch the pattern...
        </p>
      )}

      {!showing && !gameOver && (
        <p className="text-center text-green-400 font-medium">
          Your turn! Repeat the pattern.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">

        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={showing || gameOver}
            className="w-24 h-24 rounded-xl transition-all duration-200 border-2"
            style={{
              backgroundColor: activeColor === i ? c : `${c}33`,
              borderColor: activeColor === i ? c : 'transparent',
              transform: activeColor === i ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ))}

      </div>

      {gameOver && (
        <p className="text-center text-2xl font-bold text-indigo-400">
          Score: {score}%
        </p>
      )}

    </div>
  );
}

/* ---------------- Number Recall Game ---------------- */

function NumberGame({ onFinish, onBack }) {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('show');
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(0);

  const totalRounds = 5;

  const generateNumber = useCallback(() => {
    const len = round + 2;
    const num = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');

    setNumber(num);
    setInput('');
    setPhase('show');

    setTimeout(() => setPhase('input'), 2000 + len * 300);
  }, [round]);

  useEffect(() => { generateNumber(); }, [round]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCorrect = input === number;

    if (isCorrect) setCorrect(c => c + 1);

    if (round >= totalRounds) {
      const finalScore = Math.round(((correct + (isCorrect ? 1 : 0)) / totalRounds) * 100);
      setPhase('result');
      onFinish(finalScore);
    } else {
      setRound(r => r + 1);
    }
  };

  return (
    <div className="glass-card p-10 space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          🔢 Number Recall — Round {round}/{totalRounds}
        </h2>

        <button onClick={onBack} className="btn-outline text-xs py-2 px-4">
          ← Back
        </button>
      </div>

      {phase === 'show' && (
        <div className="text-center py-10">

          <p className="text-sm text-yellow-400 mb-3">
            Remember this number:
          </p>

          <p className="text-5xl font-mono font-bold tracking-widest text-indigo-400">
            {number}
          </p>

        </div>
      )}

      {phase === 'input' && (
        <form onSubmit={handleSubmit} className="text-center space-y-6 py-6">

          <p className="text-sm text-green-400">
            Type the number you saw:
          </p>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field text-center text-3xl font-mono tracking-widest max-w-xs mx-auto"
            autoFocus
            maxLength={number.length + 1}
          />

          <button type="submit" className="btn-primary px-6 py-3">
            Check ✓
          </button>

        </form>
      )}

      {phase === 'result' && (
        <p className="text-center text-2xl font-bold text-indigo-400">
          Final Score: {Math.round(((correct) / totalRounds) * 100)}%
        </p>
      )}

    </div>
  );
}

