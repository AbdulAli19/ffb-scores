import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ScorecardProps = {
  leagueName: string;
  score: number;
  opponentScore: number;
  teamName: string;
  opponentTeamName: string;
};

export const Scorecard = ({
  leagueName,
  score,
  opponentScore,
  teamName,
  opponentTeamName,
}: ScorecardProps) => {
  return (
    <Card className="min-w-[300px] max-w-lg flex-1">
      <CardHeader className="text-center">
        <CardTitle className="text-base">{leagueName}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="pr-2">
          <p>{score}</p>
          <p className="text-sm text-muted-foreground">{teamName}</p>
        </div>
        <div>vs</div>
        <div className="pl-2">
          <p>{opponentScore}</p>
          <p className="text-sm text-muted-foreground">{opponentTeamName}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ScorecardSkeleton = () => (
  <Card className="min-w-[300px] max-w-lg flex-1">
    <CardHeader className="text-center">
      <CardTitle className="text-base">
        <Skeleton height={24} width={150} />
      </CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <div className="pr-2">
        <Skeleton height={24} width={50} />
        <Skeleton height={20} width={50} />
      </div>
      <Skeleton height={24} width={16} />
      <div className="pl-2">
        <Skeleton height={24} width={50} />
        <Skeleton height={20} width={50} />
      </div>
    </CardContent>
  </Card>
);
