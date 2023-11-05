import { Scorecard } from "@/components/scorecard";
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
  const { data } = api.main.getSleeperMatchupData.useQuery({
    leagueId,
    ownerId,
    week,
  });

  if (!data) return <div>loading...</div>;

  return <Scorecard {...data} />;
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
      <div className="flex flex-wrap gap-3" suppressHydrationWarning>
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
