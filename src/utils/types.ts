export type PersistedEspnLeague = {
  type: "espn";
  leagueInfo: {
    id: string;
    teamId: string;
    cookies?: { espnS2: string; SWID: string };
    name: string;
  };
};

export type PersistedSleeperLeague = {
  type: "sleeper";
  leagueInfo: {
    id: string;
    ownerUserId: string;
  };
};

export type PersistedLeague = PersistedEspnLeague | PersistedSleeperLeague;
