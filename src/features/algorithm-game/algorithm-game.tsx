import { useState } from "react";
import { CheckCircle2, Coins, Heart, Lightbulb, LockKeyhole, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommandBuilder } from "./command-builder";
import { GameBoard } from "./game-board";
import { challenges, type CommandId, type Point } from "./game-data";

type Feedback = { tone: "success" | "error" | "info"; message: string } | null;
const delay = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function AlgorithmGame() {
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState<CommandId[]>([]);
  const [player, setPlayer] = useState<Point>(challenges[0].start);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [collected, setCollected] = useState(false);
  const [score, setScore] = useState(1250);
  const [coins, setCoins] = useState(3);
  const [completed, setCompleted] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({
    tone: "info",
    message: "Monte seu algoritmo e pressione Executar.",
  });
  const challenge = challenges[level] ?? challenges[0];

  const resetBoard = () => {
    setPlayer(challenge.start);
    setCollected(false);
    setActiveStep(null);
  };
  const resetAll = () => {
    setSequence([]);
    resetBoard();
    setFeedback({ tone: "info", message: "Sequência limpa. Tente uma nova estratégia." });
  };
  const changeLevel = (next: number) => {
    if (next > completed.length) return;
    const nextChallenge = challenges[next] ?? challenges[0];
    setLevel(next);
    setSequence([]);
    setPlayer(nextChallenge.start);
    setCollected(false);
    setActiveStep(null);
    setFeedback({
      tone: "info",
      message: "Nova missão carregada. Analise o mapa antes de começar.",
    });
  };

  const run = async () => {
    setIsRunning(true);
    setFeedback(null);
    setPlayer(challenge.start);
    setCollected(false);
    let current = { ...challenge.start };
    let hasCrystal = false;
    let previousMove: CommandId | null = null;
    let failed = false;
    for (let index = 0; index < sequence.length; index += 1) {
      setActiveStep(index);
      await delay(420);
      const command = sequence[index];
      if (!command) continue;
      const moves: CommandId[] =
        command === "repeat" && previousMove ? [previousMove, previousMove] : [command];
      for (const move of moves) {
        if (move === "collect") {
          if (
            challenge.crystal &&
            current.x === challenge.crystal.x &&
            current.y === challenge.crystal.y
          ) {
            hasCrystal = true;
            setCollected(true);
          } else {
            setFeedback({
              tone: "error",
              message: `Passo ${index + 1}: não há cristal nesta posição.`,
            });
            failed = true;
          }
          continue;
        }
        if (move === "repeat") {
          setFeedback({
            tone: "error",
            message: `Passo ${index + 1}: adicione um movimento antes de repetir.`,
          });
          failed = true;
          break;
        }
        const next = { x: current.x, y: current.y };
        if (move === "up") next.y -= 1;
        if (move === "down") next.y += 1;
        if (move === "left") next.x -= 1;
        if (move === "right") next.x += 1;
        const blocked =
          next.x < 0 ||
          next.y < 0 ||
          next.x >= challenge.size ||
          next.y >= challenge.size ||
          challenge.obstacles.some((item) => item.x === next.x && item.y === next.y);
        if (blocked) {
          setFeedback({
            tone: "error",
            message: `Passo ${index + 1}: Byte encontrou uma barreira. Reordene os comandos.`,
          });
          failed = true;
          break;
        }
        current = next;
        setPlayer(current);
        await delay(360);
        previousMove = move;
      }
      if (failed) break;
    }
    const reachedGoal = current.x === challenge.goal.x && current.y === challenge.goal.y;
    const crystalOkay = !challenge.crystal || hasCrystal;
    if (!failed && reachedGoal && crystalOkay && sequence.length <= challenge.maxSteps) {
      const firstClear = !completed.includes(level);
      setScore((value) => value + (firstClear ? 500 : 100));
      setCompleted((items) => (items.includes(level) ? items : [...items, level]));
      setFeedback({
        tone: "success",
        message:
          level === challenges.length - 1
            ? "Todas as missões concluídas. Você dominou a sequência!"
            : "Missão concluída! O próximo setor foi desbloqueado.",
      });
    } else if (!failed) {
      setFeedback({
        tone: "error",
        message:
          reachedGoal && !crystalOkay
            ? "Você chegou ao portal, mas esqueceu o cristal."
            : sequence.length > challenge.maxSteps
              ? "Funcionou, mas ultrapassou o limite de blocos."
              : "A sequência terminou antes de chegar ao portal.",
      });
    }
    setActiveStep(null);
    setIsRunning(false);
  };

  const showHint = () => {
    if (coins < 1) {
      setFeedback({
        tone: "error",
        message: "Você não tem moedas de dica. Complete uma missão para avançar.",
      });
      return;
    }
    setCoins((value) => value - 1);
    setFeedback({ tone: "info", message: challenge.hint });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="game-header">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              A<span>+</span>
            </div>
            <div>
              <p className="font-display text-lg font-black leading-none">
                ALGO<span className="text-primary">QUEST</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Laboratório de lógica
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="stat-pill">
              <Star /> <strong>{score}</strong>
              <span className="hidden sm:inline"> XP</span>
            </span>
            <span className="stat-pill">
              <Coins /> <strong>{coins}</strong>
            </span>
            <span className="stat-pill">
              <Heart /> <strong>3</strong>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
        <section className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="level-badge">MISSÃO {String(level + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold text-muted-foreground">{challenge.world}</span>
            </div>
            <h1 className="max-w-3xl font-display text-3xl font-black sm:text-5xl">
              {challenge.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {challenge.briefing}
            </p>
          </div>
          <nav aria-label="Missões" className="flex gap-2">
            {challenges.map((item, index) => {
              const locked = index > completed.length;
              return (
                <Button
                  key={item.title}
                  variant={level === index ? "levelActive" : "level"}
                  size="iconLg"
                  onClick={() => changeLevel(index)}
                  disabled={locked}
                  aria-label={
                    locked ? `Missão ${index + 1} bloqueada` : `Abrir missão ${index + 1}`
                  }
                >
                  {locked ? (
                    <LockKeyhole />
                  ) : completed.includes(index) ? (
                    <CheckCircle2 />
                  ) : (
                    index + 1
                  )}
                </Button>
              );
            })}
          </nav>
        </section>

        <section className="objective-strip mb-5">
          <div className="objective-icon">
            <Trophy />
          </div>
          <div className="min-w-0">
            <p className="eyebrow">Objetivo da missão</p>
            <p className="font-display text-lg font-bold sm:text-xl">{challenge.objective}</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 text-sm font-bold text-muted-foreground sm:flex">
            <span>PROGRESSO</span>
            <div className="progress-rail">
              <span style={{ width: `${(completed.length / challenges.length) * 100}%` }} />
            </div>
            <span>
              {completed.length}/{challenges.length}
            </span>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,0.88fr)]">
          <GameBoard
            challenge={challenge}
            player={player}
            collected={collected}
            isRunning={isRunning}
          />
          <CommandBuilder
            challenge={challenge}
            sequence={sequence}
            activeStep={activeStep}
            isRunning={isRunning}
            onAdd={(command) => setSequence((items) => [...items, command])}
            onRemove={(index) =>
              setSequence((items) => items.filter((_, itemIndex) => itemIndex !== index))
            }
            onMove={(index, direction) =>
              setSequence((items) => {
                const next = [...items];
                const target = index + direction;
                if (target < 0 || target >= next.length) return items;
                [next[index], next[target]] = [next[target] as CommandId, next[index] as CommandId];
                return next;
              })
            }
            onReorder={(from, to) =>
              setSequence((items) => {
                if (from === to || from < 0 || from >= items.length) return items;
                const next = [...items];
                const [moved] = next.splice(from, 1);
                if (!moved) return items;
                next.splice(to, 0, moved);
                return next;
              })
            }
            onUndo={() => setSequence((items) => items.slice(0, -1))}
            onReset={resetAll}
            onRun={run}
          />
        </div>

        <section
          className={cn(
            "feedback-bar mt-5",
            feedback?.tone === "success" && "feedback-success",
            feedback?.tone === "error" && "feedback-error",
          )}
          aria-live="assertive"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="feedback-signal">
              {feedback?.tone === "success" ? <CheckCircle2 /> : <Lightbulb />}
            </span>
            <p className="text-sm font-semibold">
              {feedback?.message ?? "Byte está executando seu algoritmo passo a passo..."}
            </p>
          </div>
          <Button variant="hint" size="sm" onClick={showHint} disabled={isRunning}>
            <Lightbulb /> Dica <span className="opacity-60">−1</span>
          </Button>
        </section>
      </div>
    </main>
  );
}
