import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type MatchupData = {
  score: number;
  opponentScore: number;
  teamName: string;
  opponentTeamName: string;
};

export type ScorecardProps = {
  leagueName: string;
  matchupData: MatchupData | undefined;
  className?: string;
};

const ScorecardContent = ({
  matchupData,
}: {
  matchupData: MatchupData | undefined;
}) => {
  if (!matchupData)
    return (
      <CardContent>
        {/* Random height lowkeuy but it keeps the height consistent between this and the other flex items
            TODO(abdul): use some flex or grid css here to ensure all the child items always have the same height
            regardless of dynamic content
         */}
        <div className="h-[44px]">No matchup found</div>
      </CardContent>
    );

  const { score, opponentScore, teamName, opponentTeamName } = matchupData;

  return (
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
  );
};

export const Scorecard = ({
  leagueName,
  matchupData,
  className,
}: ScorecardProps) => {
  return (
    <Card className={cn("min-w-[300px] max-w-lg flex-1", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-base">{leagueName}</CardTitle>
      </CardHeader>
      <ScorecardContent matchupData={matchupData} />
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
