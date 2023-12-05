/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { TRPCError } from "@trpc/server";
import { Client } from "espn-fantasy-football-api/node";
import { ZodError, z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

// TODO(abdul): use zod to validate the responses of all these responses
const SleeperUserSchema = z.object({
  user_id: z.string(),
});

const SleeperLeaguesSchema = z.array(
  z.object({
    name: z.string(),
    league_id: z.string(),
  }),
);

const seasonId = 2023;

type EspnLeague = {
  name: string;
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
  leagueId: string;
  teamId: number;
  cookies?: { espnS2: string; SWID: string };
  week: string;
}) => {
  const espnClient = new Client({ leagueId });

  if (cookies) espnClient.setCookies(cookies);

  const matchupPeriodId = parseInt(week);
  const scoringPeriodId = parseInt(week);
  const boxscores = (await espnClient.getBoxscoreForWeek({
    seasonId,
    matchupPeriodId,
    scoringPeriodId,
  })) as EspnBoxscore[];

  const matchup = boxscores.find(
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

  const {
    homeScore,
    awayScore,
    homeTeamId,
    awayTeamId,
    homeRoster,
    awayRoster,
    homeProjectedScore,
    awayProjectedScore,
  } = matchup;

  const homeTeam = teams.find((team) => team.id === homeTeamId);
  const awayTeam = teams.find((team) => team.id === awayTeamId);

  const isHome = teamId === homeTeamId;
  const [
    score,
    opponentScore,
    team,
    opponentTeam,
    roster,
    opponentRoster,
    projectedScore,
    opponentProjectedScore,
  ] = isHome
    ? [
        homeScore,
        awayScore,
        homeTeam,
        awayTeam,
        homeRoster,
        awayRoster,
        homeProjectedScore,
        awayProjectedScore,
      ]
    : [
        awayScore,
        homeScore,
        awayTeam,
        homeTeam,
        awayRoster,
        homeRoster,
        awayProjectedScore,
        homeProjectedScore,
      ];

  return {
    matchup: {
      score,
      opponentScore,
      roster,
      opponentRoster,
      projectedScore,
      opponentProjectedScore,
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

const getLeagueInfo = async ({
  leagueId,
  cookies,
}: {
  leagueId: string;
  cookies?: { espnS2: string; SWID: string };
}) => {
  const espnClient = new Client({ leagueId });

  if (cookies) espnClient.setCookies(cookies);

  try {
    const league = (await espnClient.getLeagueInfo({ seasonId })) as EspnLeague;
    return league;
  } catch (e: unknown) {
    console.error(e);
    // TODO(abdul): checking the message is stupid, i should check status code
    // directly after migrating off of this espn sdk
    const isPrivateLeague = (e as { message: string }).message.includes("401");
    throw new TRPCError({
      code: isPrivateLeague ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR",
      message: isPrivateLeague
        ? "It looks like you're in a private league. Add the necessary fields and try again."
        : "An unexpected error occurred, please try again later.",
      cause: e,
    });
  }
};

const getUser = async (username: string) => {
  return await fetch(`https://api.sleeper.app/v1/user/${username}`)
    .then((res) => res.json())
    .then((res) => {
      SleeperUserSchema.parse(res);
      return res as { user_id: string };
    });
};

const getLeagues = async (userId: string) => {
  return await fetch(
    `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${seasonId}`,
  )
    .then((res) => res.json())
    .then((res) => {
      SleeperLeaguesSchema.parse(res);
      return res as { name: string; league_id: string }[];
    });
};

const getLeaguesForUser = async (username: string) => {
  try {
    const user = await getUser(username);
    const leagues = await getLeagues(user.user_id);

    return {
      userId: user.user_id,
      leagues: leagues.map((league) => ({
        name: league.name,
        leagueId: league.league_id,
      })),
    };
  } catch (e) {
    console.error(e);

    if (e instanceof ZodError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: e,
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        (e as { message?: string }).message ??
        "An unexpected error occurred, please try again later.",
      cause: e,
    });
  }
};

const fetchAndFormatPlayerData = async (
  playerPoints: Record<string, number>,
  starters: string[],
) => {
  const playerData = await prisma.sleeper_players.findMany({
    where: {
      id: { in: starters },
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      position: true,
      team: true,
    },
  });

  const starterPoints = starters.map((playerId) => ({
    ...playerData.find((player) => player.id === playerId),
    points: playerPoints[playerId],
  }));

  return starterPoints;
};

const getSleeperMatchupData = async ({
  leagueId,
  ownerId,
  week,
}: {
  leagueId: string;
  ownerId: string;
  week: string;
}) => {
  const fetchLeagueData = () =>
    fetch(`https://api.sleeper.app/v1/league/${leagueId}`).then((res) =>
      res.json(),
    );
  const fetchRosterData = () =>
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`).then((res) =>
      res.json(),
    );
  const fetchMatchupData = () =>
    fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`,
    ).then((res) => res.json());

  const fetchUsersData = () =>
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`).then((res) =>
      res.json(),
    );

  try {
    const [leagueData, rosterData, matchupData, usersData] = await Promise.all([
      fetchLeagueData(),
      fetchRosterData(),
      fetchMatchupData(),
      fetchUsersData(),
    ]);
    // every roster (rosterData) has an owner_id, use that to get roster_id
    const rosterId = rosterData.find((roster) => roster.owner_id === ownerId)
      ?.roster_id;
    // matchup data has a separate record for each roster, using team's roster_id you can
    // get the matcup_id for the matchup and use that to get the 2 scores for the matchup
    const myScoreData = matchupData.find(
      (matchup) => matchup?.roster_id === rosterId,
    );

    const opponentScoreData = matchupData.find(
      (matchup) =>
        matchup?.matchup_id === myScoreData?.matchup_id &&
        matchup?.roster_id !== rosterId,
    );

    const opponentUserId = rosterData.find(
      (roster) => roster.roster_id === opponentScoreData?.roster_id,
    )?.owner_id;

    const me = usersData.find((user) => user.user_id === ownerId);
    const opponent = usersData.find((user) => user.user_id === opponentUserId);

    const scores = await fetchAndFormatPlayerData(
      (myScoreData?.players_points ?? {}) as Record<string, number>,
      (myScoreData?.starters ?? []) as string[],
    );

    const opponentScores = await fetchAndFormatPlayerData(
      (opponentScoreData?.players_points ?? {}) as Record<string, number>,
      (opponentScoreData?.starters ?? []) as string[],
    );

    const leagueName: string =
      typeof leagueData.name === "string" ? leagueData.name : "-";

    return {
      leagueName,
      score: myScoreData?.points as number,
      scores,
      opponentScore: opponentScoreData?.points,
      opponentScores,
      teamName: (me?.metadata.team_name ?? me?.display_name) as string,
      opponentTeamName: (opponent?.metadata.team_name ??
        opponent?.display_name) as string,
    };
  } catch (e) {
    console.error(e);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message:
        e.message || "An unexpected error occurred, please try again later.",
      cause: e,
    });
  }
};

export const mainRouter = createTRPCRouter({
  getEspnMatchupData: publicProcedure
    .input(
      z.object({
        leagueId: z.string(),
        teamId: z.string(),
        cookies: z.object({ espnS2: z.string(), SWID: z.string() }).optional(),
        week: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await getMatchupData({
        leagueId: input.leagueId,
        teamId: parseInt(input.teamId),
        ...(input.cookies ? { cookies: input.cookies } : {}),
        week: input.week,
      });
    }),
  // this isn't really a mutation but i like the mutate api for
  // calling a query manually. refetch on queries forces me to pass
  // the query args when i call the hook and not when i call refetch itself
  getEspnLeagueInfo: publicProcedure
    .input(
      z.object({
        leagueId: z.string(),
        cookies: z.object({ espnS2: z.string(), SWID: z.string() }).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await getLeagueInfo({ ...input });
    }),

  getSleeperLeaguesForUser: publicProcedure
    .input(z.string())
    .mutation(async ({ input: username }) => {
      return await getLeaguesForUser(username);
    }),

  getSleeperMatchupData: publicProcedure
    .input(
      z.object({ leagueId: z.string(), ownerId: z.string(), week: z.string() }),
    )
    .query(async ({ input }) => {
      return await getSleeperMatchupData({
        leagueId: input.leagueId,
        ownerId: input.ownerId,
        week: input.week,
      });
    }),
});
