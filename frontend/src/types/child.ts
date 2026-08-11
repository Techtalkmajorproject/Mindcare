export type ChildSex = "male" | "female" | "other" | "prefer_not_to_say";

export interface Child {
    id: string;
    screeningId: string;
    age: number;
    sex: ChildSex;
    createdAt: string;
}
