import { Scorecard, type ScorecardProps } from "@/components/scorecard";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PlayerScore = {
  full_name: string;
  id: string;
  points: number;
  position: string;
  team: string;
};

const PlayerList = ({ scores }: { scores: PlayerScore[] }) => {
  return (
    <div className="grid gap-4">
      {scores.map((score) => (
        <Card key={score.id}>
          <div className="flex h-24 flex-col justify-between px-6 py-4">
            <div>
              <div>{score.full_name ?? score.team}</div>
              <div className="text-xs text-slate-400">
                {score.position} - {score.team}
              </div>
            </div>
            <div>{score.points}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

type ScorecardWithModalProps = ScorecardProps & {
  scores: PlayerScore[];
  opponentScores: PlayerScore[];
  week: string;
};

export function ScorecardWithModal(props: ScorecardWithModalProps) {
  const { scores, opponentScores, week, ...scorecardProps } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="min-w-[300px] max-w-lg flex-1 cursor-pointer hover:opacity-75">
          <Scorecard {...scorecardProps} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll lg:min-w-[640px]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Week {week}</DialogTitle>
          <Scorecard {...scorecardProps} className="min-w-full max-w-full" />
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <PlayerList scores={scores} />
          <PlayerList scores={opponentScores} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
