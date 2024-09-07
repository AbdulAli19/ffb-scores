/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ScorecardSkeleton } from "@/components/scorecard";
import { ScorecardWithModal } from "@/components/scorecard-with-sheet";
import { H2 } from "@/components/ui/typography";
import { api } from "@/utils/api";
import type { PersistedSleeperLeague as SleeperLeagueConfig } from "@/utils/types";

const ScorecardContainer = ({
  league,
  week,
}: {
  league: SleeperLeagueConfig;
  week: string;
}) => {
  const { id: leagueId, ownerUserId: ownerId } = league.leagueInfo;
  const { data /*, isRefetching*/ } = api.main.getSleeperMatchupData.useQuery(
    {
      leagueId,
      ownerId,
      week,
    },
    // {
    //   refetchInterval: 6000,
    // },
  );

  // isRefetching is true when the query is being refetched

  if (!data) return <ScorecardSkeleton />;

  const scores = data.scores.map((score) => ({
    full_name: `${score.first_name} ${score.last_name}`,
    id: score.id ?? "",
    points: score.points ?? 0,
    position: score.position ?? "unknown",
    team: score.team ?? "unknown",
  }));
  const opponentScores = data.opponentScores.map((score) => ({
    full_name: `${score.first_name} ${score.last_name}`,
    id: score.id ?? "",
    points: score.points ?? 0,
    position: score.position ?? "unknown",
    team: score.team ?? "unknown",
  }));

  const { leagueName, score, opponentScore, teamName, opponentTeamName } = data;

  return (
    <ScorecardWithModal
      leagueName={leagueName}
      matchupData={{ score, opponentScore, teamName, opponentTeamName }}
      scores={scores}
      opponentScores={opponentScores}
      week={week}
    />
  );
};

export const SleeperLeagues = ({
  week,
  leagues,
}: {
  week: string;
  leagues: SleeperLeagueConfig[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <H2>Sleeper</H2>
      <div className="flex flex-wrap gap-3">
        {leagues.map((league) => (
          <ScorecardContainer
            league={league}
            week={week}
            key={league.leagueInfo.id}
          />
        ))}
      </div>
    </div>
  );
};
