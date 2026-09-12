import { createFileRoute } from "@tanstack/react-router";
import { AlgorithmGame } from "@/features/algorithm-game/algorithm-game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlgoQuest | Aprenda algoritmos jogando" },
      { name: "description", content: "Resolva desafios de lógica, organize sequências e aprenda algoritmos em missões interativas." },
      { property: "og:title", content: "AlgoQuest | Aprenda algoritmos jogando" },
      { property: "og:description", content: "Uma aventura interativa para aprender lógica e algoritmos passo a passo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AlgorithmGame />;
}
