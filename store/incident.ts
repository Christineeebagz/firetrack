import { createGenericStore } from "pinia-api-client";
import type { Incident, IncidentReport, TravelOrder } from "~~/interface/incident";

export const useIncidentStore = createGenericStore<Incident>("incident", "/incident");
export const useIncidentReportStore = createGenericStore<IncidentReport>("incident-reports", "incident/reports");
export const useTravelOrderStore = createGenericStore<TravelOrder>("travel-orders", "incident/travel-orders");
