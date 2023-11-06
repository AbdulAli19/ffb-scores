import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { EspnConnectionTab } from "@/components/espn-connection-tab";
import { EspnLeagues } from "@/components/espn-leagues";
import { SleeperConnectionTab } from "@/components/sleeper-connection-tab";
import { SleeperLeagues } from "@/components/sleeper-leagues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1 } from "@/components/ui/typography";
import type {
  PersistedEspnLeague,
  PersistedLeague,
  PersistedSleeperLeague,
} from "@/utils/types";

// TODO: write tests for this function
// function getCurrentNFLWeek() {
//   const currentDate = Date.now();
//   // Define the start date of the NFL season and the length of the season in weeks
//   const seasonStartDate = new Date("2023-09-08"); // Update with the actual start date
//   const seasonLengthInWeeks = 18; // Update with the actual season length

//   // Calculate the time difference in days between the current date and the start of the season
//   const timeDifference = currentDate - seasonStartDate.getTime();
//   const daysDifference = timeDifference / (1000 * 3600 * 24);

//   // Calculate the current NFL week
//   let currentWeek = Math.floor(daysDifference / 7);

//   // Check if it's Tuesday or a later day of the week
//   const currentDayOfWeek = new Date(currentDate).getDay();
//   if (currentDayOfWeek >= 2) {
//     currentWeek++;
//   }

//   // If the season is over, set it to the last week of the season
//   if (currentWeek > seasonLengthInWeeks) {
//     currentWeek = seasonLengthInWeeks;
//   }

//   // If it's the offseason, return the last week of the previous season
//   if (currentWeek < 1) {
//     return seasonLengthInWeeks;
//   }

//   // Return the current week
//   return currentWeek;
// }

// TODO: make week a number + stringify in api call only

const WEEKS_IN_NFL_SEASON = 18;

const App = () => {
  // TODO(abdul): make this getCurrentNFLWeek fn work
  // const [week, setWeek] = useState(String(getCurrentNFLWeek()));
  const [week, setWeek] = useState("1");
  const [leagues] = useLocalStorage<PersistedLeague[]>("leagues", []);
  const espnLeagues = leagues.filter((league) => league.type === "espn");
  const sleeperLeagues = leagues.filter((league) => league.type === "sleeper");

  if (!leagues.length) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4">
        <H1 className="text-center">Fantasy scores</H1>
        <div className="mt-8 flex flex-col items-center justify-center gap-8">
          <div>
            Welcome to the easiest way to track your scores from all your
            fantasy leagues at the same time. Connect a league below to get
            started.
          </div>
          <ConnectLeagueModal className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <H1 className="text-center">Fantasy scores</H1>
      <div className="mt-8 flex items-center justify-between">
        <Select
          value={week}
          onValueChange={(selectedWeek) => setWeek(selectedWeek)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose week of the NFL season" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: WEEKS_IN_NFL_SEASON },
              (_, index) => index + 1,
            ).map((week) => (
              <SelectItem key={week} value={String(week)}>
                Week {week}
                {/* {week === getCurrentNFLWeek() ? " (current)" : ""} */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ConnectLeagueModal />
      </div>
      <div className="mt-8 flex flex-col gap-6">
        {sleeperLeagues.length > 0 && (
          <SleeperLeagues
            week={week}
            leagues={sleeperLeagues as PersistedSleeperLeague[]}
          />
        )}
        {espnLeagues.length > 0 && (
          <EspnLeagues
            week={week}
            leagues={espnLeagues as PersistedEspnLeague[]}
          />
        )}
      </div>
    </div>
  );
};

const ConnectLeagueModal = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={() => setIsOpen((open) => !open)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={className}>Connect a league</Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="max-h-screen overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Connect a league</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="espn" className="max-w-lg">
            <TabsList className="relative mb-2 grid w-full grid-cols-3">
              <TabsTrigger value="espn">Espn</TabsTrigger>
              <TabsTrigger value="sleeper">Sleeper</TabsTrigger>
              <TabsTrigger disabled value="nfl">
                Nfl.com
              </TabsTrigger>
              <Badge className="absolute right-[-16px] top-[-4px]">Soon</Badge>
            </TabsList>
            <TabsContent value="espn">
              <EspnConnectionTab onClose={() => setIsOpen(false)} />
            </TabsContent>
            <TabsContent value="sleeper">
              <SleeperConnectionTab onClose={() => setIsOpen(false)} />
            </TabsContent>
            <TabsContent value="nfl">
              <div>Nfl.com connection instructions</div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default App;
