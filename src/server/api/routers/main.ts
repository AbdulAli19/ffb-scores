import { Client } from "espn-fantasy-football-api/node";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const seasonId = 2023;

type EspnLeague = {
  name: string;
  // isPublic: boolean;
};

type EspnTeam = {
  logoUrl: string;
  id: number;
  name: string;
};

type EspnBoxscore = {
  homeScore: number;
  awayScore: number;
  homeTeamId: number;
  awayTeamId: number;
};

const getMatchupData = async ({
  leagueId,
  teamId,
  cookies,
  week,
}: {
  leagueId: number;
  teamId: number;
  cookies?: { espnS2: string; SWID: string };
  week: string;
}) => {
  const espnClient = new Client({ leagueId });

  if (cookies) espnClient.setCookies(cookies);

  const matchupPeriodId = parseInt(week);
  const scoringPeriodId = parseInt(week);
  const boxscore = (await espnClient.getBoxscoreForWeek({
    seasonId,
    matchupPeriodId,
    scoringPeriodId,
  })) as EspnBoxscore[];

  const matchup = boxscore.find(
    (matchup) => matchup.homeTeamId === teamId || matchup.awayTeamId === teamId,
  );

  const teams = (await espnClient.getTeamsAtWeek({
    seasonId,
    scoringPeriodId,
  })) as EspnTeam[];

  // TODO(abdul): this can be an independent request, doesn't need to be coupled
  // to the rest of the matchup data
  const league = (await espnClient.getLeagueInfo({ seasonId })) as EspnLeague;

  // TODO: return sane error to handle on client if no matchup

  if (!matchup) {
    console.error("no matchup found");
    console.log({ seasonId, matchupPeriodId, scoringPeriodId, teamId });
    throw new Error(`no matchup found for teamId: ${teamId}. matchup`);
  }

  const { homeScore, awayScore, homeTeamId, awayTeamId } = matchup;

  const homeTeam = teams.find((team) => team.id === homeTeamId);
  const awayTeam = teams.find((team) => team.id === awayTeamId);

  const isHome = teamId === homeTeamId;
  const [score, opponentScore, team, opponentTeam] = isHome
    ? [homeScore, awayScore, homeTeam, awayTeam]
    : [awayScore, homeScore, awayTeam, homeTeam];

  return {
    matchup: {
      score,
      opponentScore,
    },
    teams: {
      team,
      opponentTeam,
    },
    league: {
      name: league.name,
    },
  };
};

export const mainRouter = createTRPCRouter({
  getEspnMatchupData: publicProcedure
    .input(
      z.object({
        leagueId: z.number(),
        teamId: z.number(),
        cookies: z.object({ espnS2: z.string(), SWID: z.string() }).optional(),
        week: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await getMatchupData({
        leagueId: input.leagueId,
        teamId: input.teamId,
        ...(input.cookies ? { cookies: input.cookies } : {}),
        week: input.week,
      });
    }),
});
