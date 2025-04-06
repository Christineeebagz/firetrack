import type { Firetruck } from "./vehicle";
import type { Fireman } from "./user";

export interface Incident {
    id: number;
    name: string;
    category: string;
    remarks: string;
    latitude: number;
    longitude: number;
}

export interface TravelOrder {
    id: number;
    incident: Incident;
    fireman: Fireman;
    firetruck: Firetruck;
}

export interface IncidentReport {
    id: number;
    incident: Incident;
    title: string;
    report: string;
    created_at: Date;
    updated_at: Date;
}
