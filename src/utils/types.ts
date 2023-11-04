export type PersistedEspnLeague = {
  type: "espn";
  leagueInfo: {
    id: string;
    teamId: string;
    cookies?: { espnS2: string; SWID: string };
    name: string;
    isPublic: boolean;
  };
};

export type PersistedLeague = PersistedEspnLeague;
