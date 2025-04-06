export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    is_admin: string;
    is_staff: string;
}

export interface Team {
    id: number;
    name: string;
    description: string;
}

export interface Fireman {
    id: number;
    user: User;
    team: Team[];
}

export interface IncidentCommander {
    id: number;
    user: User;
    team: Team[];
}
