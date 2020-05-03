import { PlayerSocketEvent } from "./types";

export default function eventFactory (type: PlayerSocketEvent, payload?: any) {
  return { type, payload }
}