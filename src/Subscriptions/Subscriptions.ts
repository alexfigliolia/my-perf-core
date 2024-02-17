import { createPubSub } from "graphql-yoga";
import type { Channels } from "./types";

export const Subscriptions = createPubSub<Channels>();
