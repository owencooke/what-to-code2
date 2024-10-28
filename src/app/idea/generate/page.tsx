"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialIdea } from "@/types/idea";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProgrammingCodeIdeaIcon } from "@/components/landing/Icons";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full max-w-lg lg:max-w-xl">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-12 lg:gap-24 mt-4">
      <div className="flex flex-col items-center justify-start w-full">
        <h1 className="text-5xl lg:text-6xl mb-6 text-center">
          hmm, what to code?
        </h1>
        <IdeaForm
          onClick={() => {
            setIsIdeaLoading(true);
          }}
          onSubmit={(idea) => {
            setIdea(idea);
            setIsIdeaLoading(false);
          }}
        />
      </div>
      {isIdeaLoading ? (
        <IdeaCard>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-28 w-full" />
        </IdeaCard>
      ) : idea ? (
        <IdeaCard>
          <h1 className="text-2xl">{idea.title}</h1>
          <p>{idea.description}</p>
          <div className="flex justify-center">
            <Link
              href={`/idea/expand/${idea.id}`}
              className={buttonVariants({ size: "sm" })}
            >
              {"I'm interested, tell me more"}
            </Link>
          </div>
        </IdeaCard>
      ) : (
        <IdeaCard>
          <CardContent className="flex flex-col items-center text-center text-muted-foreground select-none">
            <ProgrammingCodeIdeaIcon className="lg:w-20 lg:h-20" />
            <p className="lg:max-w-sm">
              {`"Start with something simple and small, then expand over time."`}
            </p>
            <cite>— Aaron Levie</cite>
          </CardContent>
        </IdeaCard>
      )}
    </div>
  );
}
