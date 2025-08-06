import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dice6 } from "lucide-react";

interface DiceRoll {
  id: string;
  value: number;
  timestamp: Date;
}

const DiceFace = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
  const getDots = (num: number) => {
    const dotPositions = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"]
    };
    
    return dotPositions[num as keyof typeof dotPositions] || [];
  };

  const dots = getDots(value);

  return (
    <div 
      className={`
        relative w-24 h-24 bg-surface-primary border-2 border-primary rounded-lg
        flex items-center justify-center shadow-lg
        ${isRolling ? 'animate-dice-roll' : ''}
        transition-all duration-300 hover:shadow-xl hover:border-dice-secondary
      `}
      style={{
        background: 'linear-gradient(135deg, hsl(var(--surface-primary)), hsl(var(--surface-secondary)))',
        boxShadow: isRolling ? 'var(--shadow-glow)' : 'var(--shadow-dice)'
      }}
    >
      <div className="w-full h-full relative">
        {dots.map((position, index) => (
          <div
            key={index}
            className={`
              absolute w-3 h-3 bg-dice-secondary rounded-full
              ${position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
              ${position === 'top-left' ? 'top-2 left-2' : ''}
              ${position === 'top-right' ? 'top-2 right-2' : ''}
              ${position === 'middle-left' ? 'top-1/2 left-2 -translate-y-1/2' : ''}
              ${position === 'middle-right' ? 'top-1/2 right-2 -translate-y-1/2' : ''}
              ${position === 'bottom-left' ? 'bottom-2 left-2' : ''}
              ${position === 'bottom-right' ? 'bottom-2 right-2' : ''}
            `}
          />
        ))}
      </div>
    </div>
  );
};

const DiceRollSimulator = () => {
  const [currentRoll, setCurrentRoll] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceRoll[]>([]);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        value: newValue,
        timestamp: new Date()
      };
      
      setCurrentRoll(newValue);
      setHistory(prev => [newRoll, ...prev].slice(0, 20)); // Keep last 20 rolls
      setIsRolling(false);
    }, 600);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getStats = () => {
    if (history.length === 0) return null;
    
    const total = history.reduce((sum, roll) => sum + roll.value, 0);
    const average = (total / history.length).toFixed(2);
    const highest = Math.max(...history.map(roll => roll.value));
    const lowest = Math.min(...history.map(roll => roll.value));
    
    return { total: history.length, average, highest, lowest };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            🎲 Dice Roll Simulator
          </h1>
          <p className="text-muted-foreground">
            Roll the dice and track your gaming history
          </p>
        </div>

        {/* Main Dice Area */}
        <Card className="p-8 mb-6 text-center bg-card border-border">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center">
              <DiceFace value={currentRoll} isRolling={isRolling} />
            </div>
            
            <div className="space-y-4">
              <div className="text-2xl font-bold text-foreground">
                You rolled: <span className="text-dice-secondary">{currentRoll}</span>
              </div>
              
              <Button
                onClick={rollDice}
                disabled={isRolling}
                size="lg"
                className={`
                  px-8 py-3 text-lg font-semibold transition-all duration-300
                  bg-gradient-to-r from-dice-primary to-dice-accent hover:from-dice-accent hover:to-dice-primary
                  ${isRolling ? 'animate-glow-pulse' : 'hover:scale-105'}
                `}
              >
                <Dice6 className="mr-2 h-5 w-5" />
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Statistics */}
          {stats && (
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                📊 Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-dice-primary">{stats.total}</div>
                  <div className="text-muted-foreground">Total Rolls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-dice-secondary">{stats.average}</div>
                  <div className="text-muted-foreground">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-dice-accent">{stats.highest}</div>
                  <div className="text-muted-foreground">Highest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{stats.lowest}</div>
                  <div className="text-muted-foreground">Lowest</div>
                </div>
              </div>
            </Card>
          )}

          {/* Roll History */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                📝 Roll History
              </h3>
              {history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearHistory}
                  className="text-xs border-border hover:bg-surface-accent"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">
                  No rolls yet. Roll the dice to start!
                </div>
              ) : (
                history.map((roll, index) => (
                  <div 
                    key={roll.id} 
                    className="flex items-center justify-between p-3 rounded bg-surface-secondary hover:bg-surface-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`
                          text-xs px-2 py-1 border-current
                          ${roll.value >= 5 ? 'text-dice-secondary border-dice-secondary' : 
                            roll.value >= 3 ? 'text-dice-primary border-dice-primary' : 
                            'text-muted-foreground border-muted-foreground'}
                        `}
                      >
                        {roll.value}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Roll #{history.length - index}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {roll.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiceRollSimulator;