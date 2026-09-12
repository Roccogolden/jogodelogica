import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gem, RotateCw } from "lucide-react";

export type Direction = "up" | "down" | "left" | "right";
export type CommandId = Direction | "collect" | "repeat";
export type Point = { x: number; y: number };

export interface CommandDefinition {
  id: CommandId;
  label: string;
  icon: LucideIcon;
  tone: "move" | "action" | "logic";
}

export interface Challenge {
  title: string;
  world: string;
  objective: string;
  briefing: string;
  size: number;
  start: Point;
  goal: Point;
  obstacles: Point[];
  crystal?: Point;
  commands: CommandId[];
  solution: CommandId[];
  maxSteps: number;
  hint: string;
}

export const commandDefinitions: Record<CommandId, CommandDefinition> = {
  up: { id: "up", label: "Subir", icon: ArrowUp, tone: "move" },
  down: { id: "down", label: "Descer", icon: ArrowDown, tone: "move" },
  left: { id: "left", label: "Esquerda", icon: ArrowLeft, tone: "move" },
  right: { id: "right", label: "Direita", icon: ArrowRight, tone: "move" },
  collect: { id: "collect", label: "Coletar", icon: Gem, tone: "action" },
  repeat: { id: "repeat", label: "Repetir ×2", icon: RotateCw, tone: "logic" },
};

export const challenges: [Challenge, Challenge, Challenge] = [
  {
    title: "Primeiro contato",
    world: "Setor Neon",
    objective: "Leve Byte até o portal",
    briefing: "Crie uma sequência simples e atravesse o corredor de energia.",
    size: 5,
    start: { x: 0, y: 4 },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 4 }],
    commands: ["up", "right"],
    solution: ["up", "up", "right", "right", "right"],
    maxSteps: 6,
    hint: "Suba antes de seguir para a direita.",
  },
  {
    title: "Cristal perdido",
    world: "Mina de Dados",
    objective: "Colete o cristal e alcance o portal",
    briefing: "A ordem importa: chegar ao portal sem o cristal não completa a missão.",
    size: 5,
    start: { x: 0, y: 4 },
    goal: { x: 4, y: 1 },
    crystal: { x: 2, y: 2 },
    obstacles: [{ x: 1, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
    commands: ["up", "down", "left", "right", "collect"],
    solution: ["up", "up", "right", "right", "collect", "up", "right", "right"],
    maxSteps: 9,
    hint: "O cristal está no centro. Colete-o antes de subir novamente.",
  },
  {
    title: "Loop perfeito",
    world: "Núcleo Quântico",
    objective: "Use repetição para abrir o portal",
    briefing: "Resolva com menos blocos usando o poder de repetir movimentos.",
    size: 5,
    start: { x: 0, y: 4 },
    goal: { x: 3, y: 1 },
    obstacles: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    commands: ["up", "right", "repeat"],
    solution: ["up", "repeat", "right", "repeat"],
    maxSteps: 4,
    hint: "Um movimento seguido de “Repetir ×2” avança três casas.",
  },
];
