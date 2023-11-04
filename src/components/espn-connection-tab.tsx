import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyInlineCode } from "@/components/ui/typography";
import { api } from "@/utils/api";
import type { PersistedLeague } from "@/utils/types";

const formSchema = z.object({
  leagueId: z.string(),
  teamId: z.string(),
  espnS2: z.string().optional(),
  swid: z.string().optional(),
});

export const EspnConnectionTab = ({ onClose }: { onClose: VoidFunction }) => {
  const mutation = api.main.getEspnLeagueInfo.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [leagues, setLeagues] = useLocalStorage<PersistedLeague[]>(
    "leagues",
    [],
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { leagueId, espnS2, swid, teamId } = values;
    const hasCookies = espnS2 && swid;
    const cookies = hasCookies ? { espnS2, SWID: swid } : undefined;

    mutation.mutate(
      { leagueId, cookies },
      {
        onError: (err) => {
          console.error(err);
          toast.error(err.message);
        },
        onSuccess: (data) => {
          setLeagues([
            ...leagues,
            {
              leagueInfo: {
                id: leagueId,
                teamId,
                cookies,
                name: data.name,
                isPublic: data.isPublic,
              },
              type: "espn",
            },
          ]);
          toast.success("Successfully connected league!");
          form.reset();
          onClose();
        },
      },
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="leagueId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>League Id</FormLabel>
                <FormControl>
                  <Input placeholder="12781731" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Id</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            To find these fields, go to your team page in a browser and look at
            the url. The league id is the number after{" "}
            <TypographyInlineCode>leagueId=</TypographyInlineCode> and the team
            id is the number after{" "}
            <TypographyInlineCode>teamId=</TypographyInlineCode>. If these
            instructions are unclear, refer to our helpful reference video{" "}
            <a href="#" className="underline">
              here
            </a>
            .
          </p>
          <div className="flex items-center py-2">
            <span className="h-[1px] flex-1 bg-border" />
            <span className="whitespace-nowrap px-4 text-center">
              Private league info
            </span>
            <span className="h-[1px] flex-1 bg-border" />
          </div>
          <p className="text-sm text-muted-foreground">
            The following fields are only required if your league is private. If
            you&apos;re unsure if your league is private, try adding it without
            these fields first.
          </p>
          <FormField
            control={form.control}
            name="espnS2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espn S2</FormLabel>
                <FormControl>
                  <Input placeholder="AEBm7JmtJ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="swid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SWID</FormLabel>
                <FormControl>
                  <Input placeholder="{F4A9C96..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            To find these fields, go to your league&apos;s homepage in a browser
            (try Chrome) and open the developer tools. Go to the network tab and
            hit{" "}
            <TypographyInlineCode>
              application {">"} cookies {">"} fantasy.espn.com
            </TypographyInlineCode>{" "}
            then search for the following keys:{" "}
            <TypographyInlineCode>espn_s2</TypographyInlineCode>,{" "}
            <TypographyInlineCode>SWID</TypographyInlineCode>. Copy the
            associated values and paste them into the fields above. If these
            instructions are unclear, refer to our helpful reference video{" "}
            <a href="#" className="underline">
              here
            </a>
            .
          </p>
          <Button type="submit" className="w-full">
            Connect league
          </Button>
        </form>
      </Form>
      {/* <Separator className="my-6" />
      <div>
        <H4>Connected leagues</H4>
        <div className="flex flex-col gap-2">
          {leagues.map((league) => (
            <div
              key={league.leagueInfo.id}
              className="flex items-center justify-between border-b p-4"
            >
              <div>{league.leagueInfo.name}</div>
              <Button variant="outline">Remove</Button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
