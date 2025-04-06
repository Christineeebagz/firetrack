import { createGenericStore } from "pinia-api-client";
import type { Team, Fireman, IncidentCommander } from "~~/interface/user";

export const useTeamStore = createGenericStore<Team>("teams", "/user/teams");
export const useFiremanStore = createGenericStore<Fireman>("firemen", "/user/firemen");
export const useIncidentCommanderStore = createGenericStore<IncidentCommander>("incident-commanders", "/user/incident-commanders");

