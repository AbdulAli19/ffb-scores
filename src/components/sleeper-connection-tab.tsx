import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import type { PersistedLeague, PersistedSleeperLeague } from "@/utils/types";

const formSchema = z.object({
  username: z.string(),
});

export const SleeperConnectionTab = ({
  onClose,
}: {
  onClose: VoidFunction;
}) => {
  const mutation = api.main.getSleeperLeaguesForUser.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [leagues, setLeagues] = useState<{ name: string; leagueId: string }[]>(
    [],
  );
  const [connectedLeagues, setConnectedLeagues] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isConnectionStep, setIsConnectionStep] = useState(false);
  const [persistedLeagues, setPersistedLeagues] = useLocalStorage<
    PersistedLeague[]
  >("leagues", []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values.username, {
      onError: (err) => {
        console.error(err);
        toast.error(err.message);
      },
      onSuccess: (data: {
        userId: string;
        leagues: { name: string; leagueId: string }[];
      }) => {
        if (!data.leagues.length) {
          toast.error(`No leagues found for user: ${values.username}`);
          return;
        }
        setUserId(data.userId);
        setLeagues(data.leagues);
        setConnectedLeagues(data.leagues.map((league) => league.leagueId));
        setIsConnectionStep(true);
      },
    });
  }

  if (!isConnectionStep) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="@shftyali" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name you see across the app with an `@` in front
                  of it e.g., @shftyali. Don&apos;t include the `@` here though.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Find sleeper leagues
          </Button>
        </form>
      </Form>
    );
  }

  const handleConnectLeagues = () => {
    setPersistedLeagues([
      ...persistedLeagues,
      ...connectedLeagues.map(
        (connectedLeague) =>
          ({
            leagueInfo: {
              id: connectedLeague,
              ownerUserId: userId,
            },
            type: "sleeper",
          }) as PersistedSleeperLeague,
      ),
    ]);
    onClose();
  };

  return (
    <div className="mt-8">
      <Button variant="secondary" onClick={() => setIsConnectionStep(false)}>
        Go back
      </Button>
      {leagues.length > 0 && (
        <div className="mt-4 space-y-4">
          <div>Select the leagues you want to connect</div>
          <div className="flex flex-col gap-4">
            {leagues.map((league) => (
              <div
                className="flex items-center space-x-2"
                key={league.leagueId}
              >
                <Checkbox
                  checked={connectedLeagues.includes(league.leagueId)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setConnectedLeagues([
                          ...connectedLeagues,
                          league.leagueId,
                        ])
                      : setConnectedLeagues(
                          connectedLeagues.filter(
                            (connectedLeague) =>
                              connectedLeague !== league.leagueId,
                          ),
                        );
                  }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {league.name}
                </label>
              </div>
            ))}
          </div>
          <Button
            className="w-full"
            disabled={connectedLeagues.length === 0}
            onClick={handleConnectLeagues}
          >
            Connect league{connectedLeagues.length > 1 ? "(s)" : ""}
          </Button>
        </div>
      )}
    </div>
  );
};
