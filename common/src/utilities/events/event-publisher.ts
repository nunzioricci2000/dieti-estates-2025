import type { EventListener } from "./event-listener.js";
import type { Event } from "./event.js";

export interface EventPublisher {
    publish(event: Event): void;
    addListener(listener: EventListener): void;
}