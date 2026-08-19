export type ChildSex = "male" | "female" | "other" | "prefer_not_to_say";

export interface Child {
    id: string;
    name?: string;
    age: number;
    gender?: string;
    parentName?: string;
    parentContact?: string;
    createdAt?: string | any;
}
