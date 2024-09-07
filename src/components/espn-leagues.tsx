/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ScorecardSkeleton } from "@/components/scorecard";
import { H2 } from "@/components/ui/typography";
import { api } from "@/utils/api";
import type { PersistedEspnLeague as EspnLeagueConfig } from "@/utils/types";
import { ScorecardWithModal } from "./scorecard-with-sheet";

// http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/global.html#PLAYER_AVAILABILITY_STATUSES
type PLAYER_AVAILABILITY_STATUSES = "FREEAGENT" | "ONTEAM" | "WAIVERS";

// http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/global.html#INJURY_STATUSES
type INJURY_STATUSES =
  | "ACTIVE"
  | "BEREAVEMENT"
  | "DAY_TO_DAY"
  | "DOUBTFUL"
  | "FIFTEEN_DAY_DL"
  | "INJURY_RESERVE"
  | "OUT"
  | "PATERNITY"
  | "PROBABLE"
  | "QUESTIONABLE"
  | "SEVEN_DAY_DL"
  | "SIXTY_DAY_DL"
  | "SUSPENSION"
  | "TEN_DAY_DL";

// http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/global.html#PlayerMap
type PlayerMap = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  jerseyNumber: number;
  proTeam: string;
  proTeamAbbreviation: string;
  defaultPosition: string;
  eligiblePositions: string[];
  averageDraftPosition: number;
  averageAuctionValue: number;
  percentChange: number;
  percentStarted: number;
  percentOwned: number;
  acquiredDate: Date;
  availabilityStatus: PLAYER_AVAILABILITY_STATUSES;
  isDroppable: boolean;
  isInjured: boolean;
  injuryStatus: INJURY_STATUSES;
};

// http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/global.html#ScoringItems
type PlayerStats = {
  passingAttempts: number;
  passingYards: number;
  passingCompletions: number;
  passingIncompletions: number;
  passingCompletionPercentage: number;
  passingFirstDowns: number;
  passingTouchdowns: number;
  passing2PtConversion: number;
  passingInterceptions: number;
  sacked: number;
  passingYardsPer5Yards: number;
  passingYardsPer10Yards: number;
  passingYardsPer20Yards: number;
  passingYardsPer25Yards: number;
  passingYardsPer50Yards: number;
  passingYardsPer100Yards: number;
  passingCompletionsPer5Completions: number;
  passingCompletionsPer10Completions: number;
  passingIncompletionsPer5Incompletions: number;
  passingIncompletionsPer10Incompletions: number;
  passingYards300To399: number;
  passingYards400Plus: number;
  passingTouchdowns40Plus: number;
  passingTouchdowns50Plus: number;
  rushingAttempts: number;
  rushingYards: number;
  rushingYardsPerAttempt: number;
  rushingFirstDowns: number;
  rushingTouchdowns: number;
  rushing2PtConversions: number;
  rushingYardsPer5Yards: number;
  rushingYardsPer10Yards: number;
  rushingYardsPer20Yards: number;
  rushingYardsPer25Yards: number;
  rushingYardsPer50Yards: number;
  rushingYardsPer100Yards: number;
  rushingAttemptsPer5Attempts: number;
  rushingAttemptsPer10Attempts: number;
  rushingTouchdowns40Plus: number;
  rushingTouchdowns50Plus: number;
  rushingGame100To199Yards: number;
  rushingGame200PlusYards: number;
  receivingTargets: number;
  receivingReceptions: number;
  receivingYards: number;
  receivingFirstDowns: number;
  receivingTouchdowns: number;
  receivingYardsAfterCatch: number;
  receivingYardsPerReception: number;
  receiving2PtConversions: number;
  receivingYardsPer5Yards: number;
  receivingYardsPer10Yards: number;
  receivingYardsPer20Yards: number;
  receivingYardsPer25Yards: number;
  receivingYardsPer50Yards: number;
  receivingYardsPer100Yards: number;
  receptionsPer5Receptions: number;
  receptionsPer10Receptions: number;
  receivingTouchdowns40Plus: number;
  receivingTouchdowns50Plus: number;
  receivingGame100To199Yards: number;
  receivingGame200PlusYards: number;
  fumbles: number;
  lostFumbles: number;
  totalTurnovers: number;
  madeFieldGoals: number;
  attemptedFieldGoals: number;
  missedFieldGoals: number;
  madeFieldGoalsFrom60Plus: number;
  madeFieldGoalsFrom50Plus: number;
  madeFieldGoalsFrom50To59: number;
  madeFieldGoalsFrom40To49: number;
  madeFieldGoalsFromUnder40: number;
  attemptedFieldGoalsFrom60Plus: number;
  attemptedFieldGoalsFrom50Plus: number;
  attemptedFieldGoalsFrom50To59: number;
  attemptedFieldGoalsFrom40To49: number;
  attemptedFieldGoalsFromUnder40: number;
  missedFieldGoalsFrom60Plus: number;
  missedFieldGoalsFrom50Plus: number;
  missedFieldGoalsFrom50To59: number;
  missedFieldGoalsFrom40To49: number;
  missedFieldGoalsFromUnder40: number;
  fieldGoalMadeYards: number;
  fieldGoalMadeYardsPer5Yards: number;
  fieldGoalMadeYardsPer10Yards: number;
  fieldGoalMadeYardsPer20Yards: number;
  fieldGoalMadeYardsPer25Yards: number;
  fieldGoalMadeYardsPer50Yards: number;
  fieldGoalMadeYardsPer100Yards: number;
  fieldGoalMissedYards: number;
  fieldGoalMissedYardsPer5Yards: number;
  fieldGoalMissedYardsPer10Yards: number;
  fieldGoalMissedYardsPer20Yards: number;
  fieldGoalMissedYardsPer25Yards: number;
  fieldGoalMissedYardsPer50Yards: number;
  fieldGoalMissedYardsPer100Yards: number;
  fieldGoalAttemptedYards: number;
  fieldGoalAttemptedYardsPer5Yards: number;
  fieldGoalAttemptedYardsPer10Yards: number;
  fieldGoalAttemptedYardsPer20Yards: number;
  fieldGoalAttemptedYardsPer25Yards: number;
  fieldGoalAttemptedYardsPer50Yards: number;
  fieldGoalAttemptedYardsPer100Yards: number;
  madeExtraPoints: number;
  attemptedExtraPoints: number;
  missedExtraPoints: number;
  defensiveBlockedKickForTouchdowns: number;
  defensiveInterceptions: number;
  defensiveFumbles: number;
  defensiveBlockedKicks: number;
  defensiveSafeties: number;
  defensiveSacks: number;
  defensiveHalfSacks: number;
  kickoffReturnTouchdown: number;
  puntReturnTouchdown: number;
  fumbleReturnTouchdown: number;
  interceptionReturnTouchdown: number;
  totalReturnTouchdowns: number;
  kickoffReturnYards: number;
  puntReturnYards: number;
  kickoffReturnYardsPer10Yards: number;
  kickoffReturnYardsPer25Yards: number;
  puntReturnYardsPer10Yards: number;
  puntReturnYardsPer25Yards: number;
  defensiveForcedFumbles: number;
  defensiveAssistedTackles: number;
  defensiveSoloTackles: number;
  defensiveTotalTackles: number;
  defensiveTacklesPer3Tackles: number;
  defensiveTacklesPer5Tackles: number;
  defensiveStuffs: number;
  defensivePointsAllowed: number;
  defensive0PointsAllowed: number;
  defensive1To6PointsAllowed: number;
  defensive7To13PointsAllowed: number;
  defensive14To17PointsAllowed: number;
  defensive18To21PointsAllowed: number;
  defensive22To27PointsAllowed: number;
  defensive28To34PointsAllowed: number;
  defensive35To45PointsAllowed: number;
  defensiveOver45PointsAllowed: number;
  defensiveYardsAllowed: number;
  defensiveLessThan100YardsAllowed: number;
  defensive100To199YardsAllowed: number;
  defensive200To299YardsAllowed: number;
  defensive350To399YardsAllowed: number;
  defensive400To449YardsAllowed: number;
  defensive450To499YardsAllowed: number;
  defensive500To549YardsAllowed: number;
  defensiveOver550YardsAllowed: number;
  teamWin: number;
  teamLoss: number;
  teamTie: number;
  teamPointsScored: number;
  teamWinMargin25Plus: number;
  teamWinMargin20To24: number;
  teamWinMargin15To19: number;
  teamWinMargin10To14: number;
  teamWinMargin5To9: number;
  teamWinMargin1To4: number;
  teamLossMargin25Plus: number;
  teamLossMargin20To24: number;
  teamLossMargin15To19: number;
  teamLossMargin10To14: number;
  teamLossMargin5To9: number;
  teamLossMargin1To4: number;
  netPunts: number;
  puntYards: number;
  puntsInsideThe10: number;
  puntsInsideThe20: number;
  fairCatches: number;
};

// copied from http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/global.html#BoxscorePlayerMap
// this doesn't seem to be in sync with the response from the sdk so only typing the fields i care about
type BoxscorePlayerMap = {
  player: PlayerMap;
  position: string;
  totalPoints: number;
  pointBreakdown: PlayerStats;
  rawStats: PlayerStats;
};

const getScores = (roster: BoxscorePlayerMap[]) => {
  const starters = roster.filter(
    (player: BoxscorePlayerMap) => player.position !== "Bench",
  );

  return starters.map((starter) => {
    const firstName =
      starter.player.defaultPosition === "D/ST"
        ? `${starter.player.proTeamAbbreviation}`
        : `${starter.player.firstName.slice(0, 1)}.`;

    return {
      full_name: `${firstName} ${starter.player.lastName}`,
      id: String(starter.player.id),
      points: parseFloat(starter.totalPoints.toFixed(2)),
      position: starter.player.defaultPosition,
      team: starter.player.proTeamAbbreviation,
    };
  });
};

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

  if (!data.matchup || !data.teams)
    return (
      <ScorecardWithModal
        leagueName={data.league.name}
        matchupData={undefined}
        scores={[]}
        opponentScores={[]}
        week={week}
      />
    );

  const {
    score,
    opponentScore,
    roster,
    opponentRoster,
    // projectedScore,
    // opponentProjectedScore,
  } = data.matchup;
  const { team, opponentTeam } = data.teams;

  const scorecardProps = {
    leagueName: data.league.name,
    matchupData: {
      teamName: team?.name ?? "-",
      opponentTeamName: opponentTeam?.name ?? "-",
      score,
      opponentScore,
    },
  };

  // TODO(abdul): update espn.d.ts so this stuff is typed automatically
  const scores = getScores(roster as BoxscorePlayerMap[]);
  const opponentScores = getScores(opponentRoster as BoxscorePlayerMap[]);

  return (
    <ScorecardWithModal
      {...scorecardProps}
      scores={scores}
      opponentScores={opponentScores}
      week={week}
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
