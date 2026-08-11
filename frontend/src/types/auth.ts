export interface User {
    id: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
