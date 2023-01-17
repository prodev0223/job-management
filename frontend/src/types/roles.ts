
export type Role = {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type RolesState = {
    roles: { [_id: string]: Role }
}