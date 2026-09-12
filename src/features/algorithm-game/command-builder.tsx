import { GripVertical, Play, RotateCcw, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { commandDefinitions, type Challenge, type CommandId } from "./game-data";

interface CommandBuilderProps {
  challenge: Challenge;
  sequence: CommandId[];
  activeStep: number | null;
  isRunning: boolean;
  onAdd: (command: CommandId) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onReorder: (from: number, to: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onRun: () => void;
}

export function CommandBuilder(props: CommandBuilderProps) {
  const { challenge, sequence, activeStep, isRunning } = props;
  return (
    <section className="game-panel flex min-h-[30rem] flex-col p-4 sm:p-5" aria-labelledby="builder-title">
      <div className="flex items-start justify-between gap-4">
        <div><p className="eyebrow">Seu algoritmo</p><h2 id="builder-title" className="font-display text-xl font-bold">Monte a sequência</h2></div>
        <span className={cn("step-counter", sequence.length > challenge.maxSteps && "step-counter-danger")}>
          {sequence.length}/{challenge.maxSteps}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {challenge.commands.map((commandId) => {
          const command = commandDefinitions[commandId];
          const Icon = command.icon;
          return (
            <Button key={command.id} variant="command" size="command" onClick={() => props.onAdd(command.id)} disabled={isRunning}>
              <Icon /> {command.label}
            </Button>
          );
        })}
      </div>

      <div className="sequence-track mt-4 flex-1" aria-live="polite">
        {sequence.length === 0 ? (
          <div className="flex h-full min-h-44 flex-col items-center justify-center px-5 text-center">
            <div className="empty-code">01</div>
            <p className="mt-3 font-semibold text-foreground">Seu código começa aqui</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">Toque nos comandos acima para criar uma sequência.</p>
          </div>
        ) : (
          <ol className="space-y-2 p-2">
            {sequence.map((commandId, index) => {
              const command = commandDefinitions[commandId];
              const Icon = command.icon;
              return (
                <li
                  className={cn("sequence-item", activeStep === index && "sequence-item-active")}
                  key={`${commandId}-${index}`}
                  draggable={!isRunning}
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = Number(event.dataTransfer.getData("text/plain"));
                    if (Number.isInteger(from)) props.onReorder(from, index);
                  }}
                >
                  <GripVertical className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="sequence-number">{String(index + 1).padStart(2, "0")}</span>
                  <Icon className="size-4 text-primary" />
                  <span className="flex-1 font-semibold">{command.label}</span>
                  <Button variant="ghost" size="iconSm" onClick={() => props.onMove(index, -1)} disabled={index === 0 || isRunning} aria-label={`Mover ${command.label} para cima`}>↑</Button>
                  <Button variant="ghost" size="iconSm" onClick={() => props.onMove(index, 1)} disabled={index === sequence.length - 1 || isRunning} aria-label={`Mover ${command.label} para baixo`}>↓</Button>
                  <Button variant="ghost" size="iconSm" onClick={() => props.onRemove(index)} disabled={isRunning} aria-label={`Remover ${command.label}`}><Trash2 /></Button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[auto_auto_1fr] gap-2">
        <Button variant="outline" size="iconLg" onClick={props.onUndo} disabled={!sequence.length || isRunning} aria-label="Desfazer"><Undo2 /></Button>
        <Button variant="outline" size="iconLg" onClick={props.onReset} disabled={isRunning} aria-label="Reiniciar"><RotateCcw /></Button>
        <Button variant="play" size="lg" onClick={props.onRun} disabled={!sequence.length || isRunning}><Play /> Executar</Button>
      </div>
    </section>
  );
}
