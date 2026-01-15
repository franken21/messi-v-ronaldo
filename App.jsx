import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'messi-ronaldo-players';

const ConfettiPiece = ({ delay, left }) => (
  <div
    className="absolute w-3 h-3 animate-bounce"
    style={{
      left: `${left}%`,
      top: '-10px',
      animationDelay: `${delay}ms`,
      animationDuration: '1s',
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
);

const RouletteWheel = ({ players, onComplete, label, teamColor }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const currentRotationRef = useRef(0);
  
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#A855F7'
  ];

  const segmentAngle = 360 / players.length;

  const spin = () => {
    if (isSpinning || players.length === 0) return;
    
    setIsSpinning(true);
    setHasStarted(true);
    setWinner(null);
    
    const winnerIndex = Math.floor(Math.random() * players.length);
    
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const winnerSegmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetRotation = currentRotationRef.current + (fullSpins * 360) + (360 - winnerSegmentCenter) - (currentRotationRef.current % 360);
    const segmentOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
    const finalRotation = targetRotation + segmentOffset;
    
    currentRotationRef.current = finalRotation;
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(players[winnerIndex]);
      setTimeout(() => {
        onComplete(players[winnerIndex]);
      }, 1500);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className={`text-xl font-bold mb-4 ${teamColor === 'messi' ? 'text-sky-400' : 'text-red-400'}`}>
        {label}
      </h3>
      
      <div className="relative w-72 h-72 mb-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg"
               style={{ borderTopWidth: '24px' }} />
        </div>
        
        <div 
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400 relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 6s cubic-bezier(0.15, 0.6, 0.25, 1)' : 'none',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {players.map((player, i) => {
              const startAngle = i * segmentAngle - 90;
              const endAngle = (i + 1) * segmentAngle - 90;
              const startRad = startAngle * Math.PI / 180;
              const endRad = endAngle * Math.PI / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const largeArc = segmentAngle > 180 ? 1 : 0;
              
              const midAngle = (startAngle + endAngle) / 2;
              const midRad = midAngle * Math.PI / 180;
              const textRadius = 32;
              const textX = 50 + textRadius * Math.cos(midRad);
              const textY = 50 + textRadius * Math.sin(midRad);
              
              return (
                <g key={player.id}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={colors[i % colors.length]}
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={players.length > 8 ? "4" : "5"}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {player.name.length > 8 ? player.name.substring(0, 7) + '..' : player.name}
                  </text>
                </g>
              );
            })}
            <circle cx="50" cy="50" r="8" fill="#1F2937" stroke="#FCD34D" strokeWidth="2" />
            <text x="50" y="50" fill="white" fontSize="4" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
              ⚽
            </text>
          </svg>
        </div>
        
        <div className="absolute inset-0 rounded-full pointer-events-none">
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            const x = 50 + 48 * Math.cos(angle);
            const y = 50 + 48 * Math.sin(angle);
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${isSpinning ? 'animate-pulse' : ''}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: i % 2 === 0 ? '#FCD34D' : '#FFF',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px rgba(252, 211, 77, 0.8)',
                }}
              />
            );
          })}
        </div>
      </div>
      
      {winner && !isSpinning && (
        <div className={`text-2xl font-black mb-4 animate-bounce ${teamColor === 'messi' ? 'text-sky-400' : 'text-red-400'}`}
             style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          🎉 {winner.name}! 🎉
        </div>
      )}
      
      {!hasStarted && (
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`px-8 py-4 font-bold text-xl rounded-xl transition-all shadow-lg
            ${teamColor === 'messi' 
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 active:from-sky-400 active:to-blue-500' 
              : 'bg-gradient-to-r from-red-500 to-green-600 active:from-red-400 active:to-green-500'}
            text-white disabled:opacity-50`}
        >
          🎰 SPIN!
        </button>
      )}
      
      {isSpinning && (
        <div className="text-yellow-400 text-xl font-bold animate-pulse">
          Spinner...
        </div>
      )}
    </div>
  );
};

const PlayerCard = ({ name, number, onClick, team, isCaptain, selectionMode, small }) => {
  const baseClasses = `relative rounded-xl font-bold text-center transition-all duration-300 cursor-pointer transform active:scale-95 shadow-lg ${small ? 'p-2 text-sm' : 'p-3'}`;
  
  let teamClasses = "bg-gradient-to-br from-gray-700 to-gray-900 text-white border-2 border-gray-600";
  if (team === 'messi') {
    teamClasses = "bg-gradient-to-br from-sky-400 to-blue-600 text-white border-2 border-sky-300";
  } else if (team === 'ronaldo') {
    teamClasses = "bg-gradient-to-br from-red-500 to-green-600 text-white border-2 border-red-400";
  }
  
  if (selectionMode && !team) {
    teamClasses += " ring-4 ring-yellow-400 animate-pulse";
  }

  return (
    <div className={`${baseClasses} ${teamClasses}`} onClick={onClick}>
      {isCaptain && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold shadow-md">
          👑
        </div>
      )}
      {number !== null && (
        <div className="absolute -top-2 -left-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-gray-800">
          {number}
        </div>
      )}
      <div className="truncate">{name}</div>
    </div>
  );
};

const BoomText = ({ text }) => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
    <div className="text-5xl font-black text-yellow-400 animate-ping" style={{ textShadow: '4px 4px 0px #000, -4px -4px 0px #000' }}>
      {text}
    </div>
  </div>
);

export default function MessiVsRonaldo() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [messiCaptain, setMessiCaptain] = useState(null);
  const [ronaldoCaptain, setRonaldoCaptain] = useState(null);
  const [messiTeam, setMessiTeam] = useState([]);
  const [ronaldoTeam, setRonaldoTeam] = useState([]);
  const [playerNumbers, setPlayerNumbers] = useState({});
  const [phase, setPhase] = useState('roster');
  const [captainMode, setCaptainMode] = useState('random');
  const [selectingCaptain, setSelectingCaptain] = useState(null);
  const [currentPicker, setCurrentPicker] = useState('messi');
  const [showBoom, setShowBoom] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [rouletteStep, setRouletteStep] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedPlayers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players.map(p => p.name)));
    }
  }, [players]);

  const triggerBoom = (text) => {
    setShowBoom(text);
    setTimeout(() => setShowBoom(null), 800);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.find(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      setPlayers([...players, { name: newPlayerName.trim(), id: Date.now() }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const loadSavedPlayers = () => {
    const newPlayers = savedPlayers
      .filter(name => !players.find(p => p.name.toLowerCase() === name.toLowerCase()))
      .map((name, i) => ({ name, id: Date.now() + i }));
    setPlayers([...players, ...newPlayers]);
    triggerBoom('LASTET!');
  };

  const startRouletteSelection = () => {
    if (players.length < 2) return;
    setPhase('roulette');
    setRouletteStep(1);
  };

  const handleMessiSelected = (player) => {
    setMessiCaptain(player);
    triggerConfetti();
    setTimeout(() => {
      setRouletteStep(2);
    }, 500);
  };

  const handleRonaldoSelected = (player) => {
    setRonaldoCaptain(player);
    triggerConfetti();
    setTimeout(() => {
      setPhase('captainSelect');
    }, 500);
  };

  const startManualCaptainSelect = () => {
    setCaptainMode('manual');
    setSelectingCaptain('messi');
    setPhase('captainSelect');
  };

  const selectManualCaptain = (player) => {
    if (selectingCaptain === 'messi') {
      setMessiCaptain(player);
      setSelectingCaptain('ronaldo');
      triggerBoom('MESSI!');
    } else if (selectingCaptain === 'ronaldo') {
      setRonaldoCaptain(player);
      setSelectingCaptain(null);
      triggerBoom('RONALDO!');
      triggerConfetti();
    }
  };

  const assignNumbers = () => {
    const remainingPlayers = players.filter(
      p => p.id !== messiCaptain?.id && p.id !== ronaldoCaptain?.id
    );
    
    const numbers = remainingPlayers.map((_, i) => i + 1).sort(() => Math.random() - 0.5);
    const numberMap = {};
    remainingPlayers.forEach((player, i) => {
      numberMap[player.id] = numbers[i];
    });
    
    setPlayerNumbers(numberMap);
    setPhase('numbersAssigned');
    triggerBoom('NUMMER!');
  };

  const startDraft = () => {
    setPhase('drafting');
    setCurrentPicker('messi');
  };

  const pickPlayer = (player) => {
    if (phase !== 'drafting') return;
    
    if (currentPicker === 'messi') {
      setMessiTeam([...messiTeam, player]);
      setCurrentPicker('ronaldo');
    } else {
      setRonaldoTeam([...ronaldoTeam, player]);
      setCurrentPicker('messi');
    }
    
    const remainingAfterPick = players.filter(
      p => p.id !== messiCaptain?.id && 
           p.id !== ronaldoCaptain?.id && 
           p.id !== player.id &&
           !messiTeam.find(t => t.id === p.id) &&
           !ronaldoTeam.find(t => t.id === p.id)
    );
    
    if (remainingAfterPick.length === 0) {
      setPhase('complete');
      triggerConfetti();
      triggerBoom('FERDIG!');
    }
  };

  const autoDraft = () => {
    const remaining = players.filter(
      p => p.id !== messiCaptain?.id && 
           p.id !== ronaldoCaptain?.id &&
           !messiTeam.find(t => t.id === p.id) &&
           !ronaldoTeam.find(t => t.id === p.id)
    ).sort(() => Math.random() - 0.5);
    
    const newMessi = [];
    const newRonaldo = [];
    let picker = currentPicker;
    
    remaining.forEach(player => {
      if (picker === 'messi') {
        newMessi.push(player);
        picker = 'ronaldo';
      } else {
        newRonaldo.push(player);
        picker = 'messi';
      }
    });
    
    setMessiTeam([...messiTeam, ...newMessi]);
    setRonaldoTeam([...ronaldoTeam, ...newRonaldo]);
    setPhase('complete');
    triggerConfetti();
    triggerBoom('LAGENE!');
  };

  const resetAll = () => {
    setMessiCaptain(null);
    setRonaldoCaptain(null);
    setMessiTeam([]);
    setRonaldoTeam([]);
    setPlayerNumbers({});
    setPhase('roster');
    setCaptainMode('random');
    setSelectingCaptain(null);
    setCurrentPicker('messi');
    setRouletteStep(0);
  };

  const remainingPlayers = players.filter(
    p => p.id !== messiCaptain?.id && 
         p.id !== ronaldoCaptain?.id &&
         !messiTeam.find(t => t.id === p.id) &&
         !ronaldoTeam.find(t => t.id === p.id)
  );

  const playersForRonaldoWheel = players.filter(p => p.id !== messiCaptain?.id);
  const canShowReset = phase !== 'roster' && phase !== 'roulette';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 p-3 pb-16 relative overflow-hidden">
      {/* Stadium lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <ConfettiPiece key={i} delay={i * 50} left={Math.random() * 100} />
          ))}
        </div>
      )}

      {/* Boom Text */}
      {showBoom && <BoomText text={showBoom} />}

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-black text-white mb-1" style={{ textShadow: '2px 2px 0px #000' }}>
            ⚽ MESSI <span className="text-yellow-400">vs</span> RONALDO
          </h1>
          <p className="text-green-200 text-sm">Lagvelger</p>
        </div>

        {/* Roster Phase */}
        {phase === 'roster' && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-3">📋 Spillere</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Skriv navn..."
                className="flex-1 px-3 py-3 rounded-xl bg-white/90 text-gray-800 font-semibold placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-base"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={addPlayer}
                className="px-5 py-3 bg-yellow-400 active:bg-yellow-300 text-black font-bold rounded-xl transition-all"
              >
                LEGG TIL
              </button>
            </div>

            {savedPlayers.length > 0 && players.length === 0 && (
              <button
                onClick={loadSavedPlayers}
                className="w-full mb-3 px-4 py-3 bg-purple-500 active:bg-purple-400 text-white font-bold rounded-xl transition-all"
              >
                📂 Last inn forrige spillere ({savedPlayers.length})
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {players.map(player => (
                <div key={player.id} className="relative">
                  <PlayerCard name={player.name} number={null} team={null} small={true} />
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 active:bg-red-400 text-white rounded-full font-bold text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {players.length >= 2 && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={startRouletteSelection}
                  className="w-full px-4 py-4 bg-gradient-to-r from-sky-500 to-red-500 active:from-sky-400 active:to-red-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                >
                  🎰 VELG FUS OG AND
                </button>
                <button
                  onClick={startManualCaptainSelect}
                  className="w-full px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 active:from-purple-400 active:to-pink-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                >
                  👆 VELG KAPTEINER MANUELT
                </button>
              </div>
            )}

            {players.length < 2 && (
              <p className="text-center text-yellow-300 font-semibold text-sm">Legg til minst 2 spillere for å starte!</p>
            )}
          </div>
        )}

        {/* Roulette Phase */}
        {phase === 'roulette' && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-4">
            {rouletteStep === 1 && (
              <RouletteWheel
                players={players}
                onComplete={handleMessiSelected}
                label="🇦🇷 VELG MESSI-KAPTEIN"
                teamColor="messi"
              />
            )}
            {rouletteStep === 2 && (
              <RouletteWheel
                players={playersForRonaldoWheel}
                onComplete={handleRonaldoSelected}
                label="🇵🇹 VELG RONALDO-KAPTEIN"
                teamColor="ronaldo"
              />
            )}
          </div>
        )}

        {/* Manual Captain Selection */}
        {phase === 'captainSelect' && captainMode === 'manual' && selectingCaptain && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-3 text-center">
              {selectingCaptain === 'messi' ? (
                <span className="text-sky-400">👆 Velg MESSI-kaptein</span>
              ) : (
                <span className="text-red-400">👆 Velg RONALDO-kaptein</span>
              )}
            </h2>
            
            <div className="grid grid-cols-3 gap-2">
              {players.filter(p => p.id !== messiCaptain?.id).map(player => (
                <div key={player.id} onClick={() => selectManualCaptain(player)}>
                  <PlayerCard 
                    name={player.name} 
                    number={null} 
                    team={null}
                    selectionMode={true}
                    small={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Captains Selected - Ready for Numbers */}
        {phase === 'captainSelect' && messiCaptain && ronaldoCaptain && !selectingCaptain && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-3 text-center">👑 KAPTEINER VALGT!</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <p className="text-sky-300 font-bold text-sm mb-1">Team Messi</p>
                <PlayerCard name={messiCaptain.name} number={null} team="messi" isCaptain={true} />
              </div>
              <div className="text-center">
                <p className="text-red-300 font-bold text-sm mb-1">Team Ronaldo</p>
                <PlayerCard name={ronaldoCaptain.name} number={null} team="ronaldo" isCaptain={true} />
              </div>
            </div>

            <button
              onClick={assignNumbers}
              className="w-full px-4 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 active:from-yellow-400 active:to-orange-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg"
            >
              🔢 TILDEL NUMMER
            </button>
          </div>
        )}

        {/* Numbers Assigned - Ready for Draft */}
        {(phase === 'numbersAssigned' || phase === 'drafting') && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className={`bg-gradient-to-br from-sky-500/30 to-blue-600/30 backdrop-blur rounded-xl p-2 border-2 ${currentPicker === 'messi' && phase === 'drafting' ? 'border-yellow-400' : 'border-sky-400/50'}`}>
                <h3 className="text-sm font-bold text-sky-300 mb-2 text-center">
                  🇦🇷 MESSI
                  {currentPicker === 'messi' && phase === 'drafting' && <span className="block text-yellow-400 text-xs">VELGER</span>}
                </h3>
                <div className="space-y-1">
                  {messiCaptain && <PlayerCard name={messiCaptain.name} number={null} team="messi" isCaptain={true} small={true} />}
                  {messiTeam.map(player => (
                    <PlayerCard key={player.id} name={player.name} number={null} team="messi" small={true} />
                  ))}
                </div>
              </div>

              <div className={`bg-gradient-to-br from-red-500/30 to-green-600/30 backdrop-blur rounded-xl p-2 border-2 ${currentPicker === 'ronaldo' && phase === 'drafting' ? 'border-yellow-400' : 'border-red-400/50'}`}>
                <h3 className="text-sm font-bold text-red-300 mb-2 text-center">
                  🇵🇹 RONALDO
                  {currentPicker === 'ronaldo' && phase === 'drafting' && <span className="block text-yellow-400 text-xs">VELGER</span>}
                </h3>
                <div className="space-y-1">
                  {ronaldoCaptain && <PlayerCard name={ronaldoCaptain.name} number={null} team="ronaldo" isCaptain={true} small={true} />}
                  {ronaldoTeam.map(player => (
                    <PlayerCard key={player.id} name={player.name} number={null} team="ronaldo" small={true} />
                  ))}
                </div>
              </div>
            </div>

            {remainingPlayers.length > 0 && (
              <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-3">
                <h2 className="text-lg font-bold text-white mb-3 text-center">
                  {phase === 'numbersAssigned' ? '🎯 Spillere klare!' : '🎯 Velg en spiller!'}
                </h2>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {remainingPlayers
                    .sort((a, b) => (playerNumbers[a.id] || 0) - (playerNumbers[b.id] || 0))
                    .map(player => (
                      <div 
                        key={player.id} 
                        onClick={() => phase === 'drafting' && pickPlayer(player)}
                        className={phase === 'drafting' ? 'cursor-pointer' : ''}
                      >
                        <PlayerCard 
                          name={player.name} 
                          number={playerNumbers[player.id]} 
                          team={null}
                          selectionMode={phase === 'drafting'}
                          small={true}
                        />
                      </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                  {phase === 'numbersAssigned' && (
                    <button
                      onClick={startDraft}
                      className="w-full px-4 py-4 bg-gradient-to-r from-green-500 to-emerald-500 active:from-green-400 active:to-emerald-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                    >
                      👆 MANUELL VELGING
                    </button>
                  )}
                  <button
                    onClick={autoDraft}
                    className="w-full px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 active:from-purple-400 active:to-pink-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg"
                  >
                    🎲 AUTOMATISK VELGING
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Complete Phase */}
        {phase === 'complete' && (
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-3">
            <h2 className="text-2xl font-black text-yellow-400 mb-4 text-center" style={{ textShadow: '2px 2px 0px #000' }}>
              ⚡ LAGENE ER KLARE! ⚡
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-sky-500/30 to-blue-600/30 backdrop-blur rounded-xl p-3 border-2 border-sky-400">
                <h3 className="text-lg font-bold text-sky-300 mb-2 text-center">🇦🇷 MESSI</h3>
                <div className="space-y-1">
                  {messiCaptain && <PlayerCard name={messiCaptain.name} number={null} team="messi" isCaptain={true} small={true} />}
                  {messiTeam.map(player => (
                    <PlayerCard key={player.id} name={player.name} number={null} team="messi" small={true} />
                  ))}
                </div>
                <p className="text-center text-sky-200 mt-2 font-bold text-sm">{1 + messiTeam.length} spillere</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/30 to-green-600/30 backdrop-blur rounded-xl p-3 border-2 border-red-400">
                <h3 className="text-lg font-bold text-red-300 mb-2 text-center">🇵🇹 RONALDO</h3>
                <div className="space-y-1">
                  {ronaldoCaptain && <PlayerCard name={ronaldoCaptain.name} number={null} team="ronaldo" isCaptain={true} small={true} />}
                  {ronaldoTeam.map(player => (
                    <PlayerCard key={player.id} name={player.name} number={null} team="ronaldo" small={true} />
                  ))}
                </div>
                <p className="text-center text-red-200 mt-2 font-bold text-sm">{1 + ronaldoTeam.length} spillere</p>
              </div>
            </div>

            <div className="text-center text-4xl mb-2">⚽ VS ⚽</div>
          </div>
        )}

        {/* Reset Button */}
        {canShowReset && (
          <button
            onClick={resetAll}
            className="w-full px-4 py-3 bg-gray-700 active:bg-gray-600 text-white font-bold rounded-xl transition-all"
          >
            🔄 START PÅ NYTT
          </button>
        )}
      </div>

      {/* Footer Logo */}
      <div className="fixed bottom-0 left-0 right-0 py-3 text-center">
        <p className="text-green-300/60 text-xs font-medium tracking-wide">
          Laget av Charlie ⚽
        </p>
      </div>
    </div>
  );
}
