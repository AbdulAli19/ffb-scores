import { Scorecard, ScorecardSkeleton } from "@/components/scorecard";
import { H2 } from "@/components/ui/typography";
import { api } from "@/utils/api";
import type { PersistedEspnLeague as EspnLeagueConfig } from "@/utils/types";

const EspnScorecardContainer = ({
  league,
  week,
}: {
  league: EspnLeagueConfig;
  week: string;
}) => {
  const { id: leagueId, teamId, cookies } = league.leagueInfo;
  const { data } = api.main.getEspnMatchupData.useQuery({
    leagueId,
    teamId,
    cookies,
    week,
  });

  if (!data) return <ScorecardSkeleton />;

  const { score, opponentScore } = data.matchup;
  const { team, opponentTeam } = data.teams;

  return (
    <Scorecard
      leagueName={data.league.name}
      teamName={team?.name ?? "-"}
      opponentTeamName={opponentTeam?.name ?? "-"}
      {...{ score, opponentScore }}
    />
  );
};

export const EspnLeagues = ({
  week,
  leagues,
}: {
  week: string;
  leagues: EspnLeagueConfig[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <H2>Espn</H2>
      <div className="flex flex-wrap gap-3">
        {leagues.map((league) => (
          <EspnScorecardContainer
            league={league}
            week={week}
            key={league.leagueInfo.id}
          />
        ))}
      </div>
    </div>
  );
};
