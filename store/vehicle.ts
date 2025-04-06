import { createGenericStore } from "pinia-api-client";
import type { Firetruck } from "~~/interface/vehicle";

export const useFiretruckStore = createGenericStore<Firetruck>("firetruck", "/vehicle/firetrucks");
