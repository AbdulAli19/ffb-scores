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

export type PersistedSleeperLeague = {
  type: "sleeper";
  leagueInfo: {
    id: string;
    ownerUserId: string;
    // ownerUsername: string;
    // ownerDisplayName: string;
  };
};

export type PersistedLeague = PersistedEspnLeague | PersistedSleeperLeague;
