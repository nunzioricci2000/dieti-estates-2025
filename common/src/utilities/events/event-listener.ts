import type { Event } from "./event.js";

export interface EventListener {
    onEvent(event: Event): void;
}
