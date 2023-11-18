import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { END_OF_WEEK_1, ONE_WEEK, WEEKS_IN_SEASON } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentNFLWeek(date: Date) {
  let runningDate = END_OF_WEEK_1;
  let week = 1;
  while (date >= runningDate && week < WEEKS_IN_SEASON) {
    week++;
    // add 1 week to runningDate
    runningDate = new Date(runningDate.getTime() + ONE_WEEK);
  }
  return week;
}
