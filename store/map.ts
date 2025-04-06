import { createGenericStore } from "pinia-api-client";
import type { FiretruckCoordinates, FiremanCoordinates } from "~~/interface/map";

export const useFiretruckCoordinatesStore = createGenericStore<FiretruckCoordinates>("firetruck-coordinates", "/map/firetruck-coordinates");
export const useFiremanCoordinatesStore = createGenericStore<FiremanCoordinates>("fireman-coordinates", "/map/fireman-coordinates");
