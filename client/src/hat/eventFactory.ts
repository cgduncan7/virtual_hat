import { HatSocketEvent } from "./types";

export default function eventFactory (type: HatSocketEvent, payload?: any) {
  return { type, payload }
}