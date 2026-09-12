import { Bot, Gem, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge, Point } from "./game-data";

interface GameBoardProps {
  challenge: Challenge;
  player: Point;
  collected: boolean;
  isRunning: boolean;
}

const samePoint = (first: Point, second: Point) => first.x === second.x && first.y === second.y;

export function GameBoard({ challenge, player, collected, isRunning }: GameBoardProps) {
  const cells = Array.from({ length: challenge.size * challenge.size }, (_, index) => ({
    x: index % challenge.size,
    y: Math.floor(index / challenge.size),
  }));

  return (
    <section aria-label="Simulador da missão" className="game-panel overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Simulador</p>
          <h2 className="font-display text-xl font-bold text-foreground">{challenge.world}</h2>
        </div>
        <span className={cn("status-dot", isRunning && "status-dot-active")}>
          {isRunning ? "Executando" : "Pronto"}
        </span>
      </div>
      <div
        className="game-grid mx-auto"
        style={{ gridTemplateColumns: `repeat(${challenge.size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const hasPlayer = samePoint(cell, player);
          const hasGoal = samePoint(cell, challenge.goal);
          const hasObstacle = challenge.obstacles.some((item) => samePoint(item, cell));
          const hasCrystal = challenge.crystal && samePoint(cell, challenge.crystal) && !collected;
          return (
            <div className="game-cell" key={`${cell.x}-${cell.y}`}>
              {hasGoal && <Sparkles className="cell-goal" aria-label="Portal" />}
              {hasObstacle && <ShieldAlert className="cell-obstacle" aria-label="Obstáculo" />}
              {hasCrystal && <Gem className="cell-crystal" aria-label="Cristal" />}
              {hasPlayer && (
                <span className={cn("player-token", isRunning && "player-running")} aria-label="Byte">
                  <Bot />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5"><Bot className="size-4 text-primary" /> Byte</span>
        <span className="flex items-center gap-1.5"><Sparkles className="size-4 text-goal" /> Portal</span>
        {challenge.crystal && <span className="flex items-center gap-1.5"><Gem className="size-4 text-crystal" /> Cristal</span>}
      </div>
    </section>
  );
}
