import type { Fireman } from "./user";
import type { Firetruck } from "./vehicle";

export interface FiremanCoordinates {
    id: number;
    latitude: number;
    longitude: number;
    timestamp: Date;
    fireman: Fireman;
}

export interface FiretruckCoordinates {
    id: number;
    latitude: number;
    longitude: number;
    timestamp: Date;
    truck: Firetruck;
}
