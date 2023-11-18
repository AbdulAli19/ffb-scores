import { expect, test } from "vitest";
import { getCurrentNFLWeek } from "./utils";

const dates: [string, number][] = [
  // before season
  ["2023-09-06", 1],
  ["2023-09-10", 1],
  // all wednesdays
  ["2023-09-13", 2],
  ["2023-09-20", 3],
  ["2023-09-27", 4],
  ["2023-10-04", 5],
  ["2023-10-11", 6],
  ["2023-10-18", 7],
  ["2023-10-25", 8],
  ["2023-11-01", 9],
  ["2023-11-08", 10],
  ["2023-11-15", 11],
  // random dates
  ["2023-11-12", 10],
  ["2023-11-13", 10],
  // start of day tuesday is still previous week
  ["2023-11-14", 10],
  ["2023-11-14T13:00:00", 11],
  ["2024-01-08", 18],
  ["2024-04-08", 18],
];

test("calculates correct nfl week for date", () => {
  dates.forEach(([date, week]) => {
    expect(getCurrentNFLWeek(new Date(date))).toBe(week);
  });
});
