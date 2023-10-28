import { useState } from "react";
import Head from "next/head";

import { env } from "@/env.mjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H1, H2 } from "@/components/ui/typography";
import { api } from "@/utils/api";

// TODO: this is a duplicated type
type EspnTeam = {
  logoUrl: string;
  id: number;
  name: string;
};

// TODO: this is a duplicated type
type EspnLeague = {
  name: string;
  // isPublic: boolean;
};

type EspnLeagueConfig = {
  leagueId: number;
  teamId: number;
  cookies?: {
    espnS2: string;
    SWID: string;
  };
};

const espnLeagues = [
  // nairobi nationals (16 man)
  {
    leagueId: 1278173159,
    teamId: 10,
    cookies: {
      espnS2: env.NEXT_PUBLIC_ESPN_S2,
      SWID: env.NEXT_PUBLIC_ESPN_SWID,
    },
  },
  // la liga (tahlil's boys)
  {
    leagueId: 354742702,
    teamId: 6,
    cookies: {
      espnS2: env.NEXT_PUBLIC_ESPN_S2B,
      SWID: env.NEXT_PUBLIC_ESPN_SWID,
    },
  },
  // JHERBO (badaso league)
  {
    leagueId: 936712529,
    teamId: 8,
    cookies: {
      espnS2: env.NEXT_PUBLIC_ESPN_S2C,
      SWID: env.NEXT_PUBLIC_ESPN_SWID,
    },
  },
  // goat squad
  {
    leagueId: 575453,
    teamId: 10,
    cookies: {
      espnS2: env.NEXT_PUBLIC_ESPN_S2D,
      SWID: env.NEXT_PUBLIC_ESPN_SWID,
    },
  },
];

// TODO: write tests for this function
function getCurrentNFLWeek() {
  const currentDate = Date.now();
  // Define the start date of the NFL season and the length of the season in weeks
  const seasonStartDate = new Date("2023-09-08"); // Update with the actual start date
  const seasonLengthInWeeks = 18; // Update with the actual season length

  // Calculate the time difference in days between the current date and the start of the season
  const timeDifference = currentDate - seasonStartDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  // Calculate the current NFL week
  let currentWeek = Math.floor(daysDifference / 7);

  // Check if it's Tuesday or a later day of the week
  const currentDayOfWeek = new Date(currentDate).getDay();
  if (currentDayOfWeek >= 2) {
    currentWeek++;
  }

  // If the season is over, set it to the last week of the season
  if (currentWeek > seasonLengthInWeeks) {
    currentWeek = seasonLengthInWeeks;
  }

  // If it's the offseason, return the last week of the previous season
  if (currentWeek < 1) {
    return seasonLengthInWeeks;
  }

  // Return the current week
  return currentWeek;
}

// TODO: make week a number + stringify in api call only

const WEEKS_IN_NFL_SEASON = 18;
// const SLEEPER_LEAGUE_ID = "992090350321717248";
// const ROSTER_ID = 6;

// type LeagueData = {
//   name: string;
// };

// type RosterData = {
//   roster_id: number;
//   owner_id: string;
// };

// type Matchup = {
//   roster_id: number;
//   matchup_id: number;
//   points: number;
// };

// type ScorecardProps = {
//   leagueData: LeagueData;
//   rosterData: RosterData[];
//   matchupData: Matchup[];
// };

// const getScorecardData = ({
//   leagueData,
//   rosterData,
//   matchupData,
// }: ScorecardProps) => {
//   const myScoreData = matchupData.find(
//     (matchup) => matchup?.roster_id === ROSTER_ID,
//   );

//   const userId = rosterData.find(
//     (roster) => roster.roster_id === myScoreData?.roster_id,
//   )?.owner_id;

//   const opponentScoreData = matchupData.find(
//     (matchup) =>
//       matchup?.matchup_id === myScoreData?.matchup_id &&
//       matchup?.roster_id !== ROSTER_ID,
//   );

//   const opponentUserId = rosterData.find(
//     (roster) => roster.roster_id === opponentScoreData?.roster_id,
//   )?.owner_id;

//   return {
//     leagueName: leagueData.name,
//     score: myScoreData?.points,
//     userId,
//     opponentScore: opponentScoreData?.points,
//     opponentUserId,
//   };
// };

// type Team = {
//   user_id: string;
//   metadata: {
//     team_name?: string;
//   };
//   display_name: string;
// };

// const TeamName = ({
//   userId,
//   leagueId,
// }: {
//   userId: string;
//   leagueId: string;
// }) => {
//   const { data } = useSWR<Team[]>(
//     `https://api.sleeper.app/v1/league/${leagueId}/users`,
//     fetcher,
//   );

//   if (!data) return <p>loading...</p>;

//   const team = data.find((team) => team.user_id === userId);

//   return (
//     <p className="text-muted-foreground text-sm">
//       {team?.metadata.team_name ?? team?.display_name}
//     </p>
//   );
// };

// const Scorecard = ({ leagueData, matchupData, rosterData }: ScorecardProps) => {
//   const { leagueName, score, userId, opponentScore, opponentUserId } =
//     getScorecardData({
//       leagueData,
//       matchupData,
//       rosterData,
//     });

//   return (
//     <Card className="max-w-md">
//       <CardHeader className="text-center">
//         <CardTitle>{leagueName}</CardTitle>
//       </CardHeader>
//       <CardContent className="flex items-center justify-between">
//         <div>
//           <p>{score}</p>
//           <TeamName userId={userId!} leagueId={SLEEPER_LEAGUE_ID} />
//         </div>
//         <div>vs</div>
//         <div>
//           <p>{opponentScore}</p>
//           <TeamName userId={opponentUserId!} leagueId={SLEEPER_LEAGUE_ID} />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

type Matchup = {
  score: number;
  opponentScore: number;
};

const EspnScorecardContainer = ({
  league,
  week,
}: {
  league: EspnLeagueConfig;
  week: string;
}) => {
  const { leagueId, teamId, cookies } = league;
  const { data } = api.main.getEspnMatchupData.useQuery({
    leagueId,
    teamId,
    cookies,
    week,
  });

  if (!data) return <div>loading...</div>;

  return (
    <EspnScorecard
      matchup={data.matchup}
      teams={data.teams}
      league={data.league}
    />
  );
};

type EspnScorecardProps = {
  matchup: Matchup;
  teams: {
    team: EspnTeam | undefined;
    opponentTeam: EspnTeam | undefined;
  };
  league: EspnLeague;
};

const EspnScorecard = ({ matchup, teams, league }: EspnScorecardProps) => {
  const { score, opponentScore } = matchup;
  const { team, opponentTeam } = teams;

  return (
    <Card className="min-w-[300px] max-w-lg flex-1">
      <CardHeader className="text-center">
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="pr-2">
          <p>{score}</p>
          <p className="text-sm text-muted-foreground">{team?.name}</p>
        </div>
        <div>vs</div>
        <div className="pl-2">
          <p>{opponentScore}</p>
          <p className="text-sm text-muted-foreground">{opponentTeam?.name}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// const SleeperLeagues = ({ week }: { week: string }) => {
//   const { data: leagueData } = useSWR(
//     `https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}`,
//     fetcher,
//   );
//   const { data: rosterData } = useSWR(
//     `https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/rosters`,
//     fetcher,
//   );
//   const { data } = useSWR(
//     `https://api.sleeper.app/v1/league/${SLEEPER_LEAGUE_ID}/matchups/${week}`,
//     fetcher,
//   );

//   const hasData = leagueData && rosterData && data;

//   if (!hasData) return <div>loading...</div>;

//   return (
//     <Scorecard
//       leagueData={leagueData}
//       rosterData={rosterData}
//       matchupData={data}
//     />
//   );
// };

const EspnLeagues = ({
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
            key={league.leagueId}
          />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  // TODO: get current week of nfl season
  // const [week, setWeek] = useState("1");
  const [week, setWeek] = useState(String(getCurrentNFLWeek()));

  return (
    <>
      <Head>
        <title>FFB Scores</title>
      </Head>
      <div className="p-4">
        <H1 className="text-center">Fantasy scores</H1>
        <div className="mt-8">
          <Select
            value={week}
            onValueChange={(selectedWeek) => setWeek(selectedWeek)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: WEEKS_IN_NFL_SEASON },
                (_, index) => index + 1,
              ).map((week) => (
                <SelectItem key={week} value={String(week)}>
                  Week {week}
                  {week === getCurrentNFLWeek() ? " (current)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-8 flex flex-col gap-6">
          {/* <SleeperLeagues week={week} /> */}
          <EspnLeagues week={week} leagues={espnLeagues} />
        </div>
      </div>
    </>
  );
}
