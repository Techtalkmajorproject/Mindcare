import type { Child, ChildSex } from "../types/child";

const STORAGE_KEY = "multimodal_screening_children";

function getStoredChildren(): Child[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        return JSON.parse(stored) as Child[];
    } catch {
        return [];
    }
}

function saveChildren(children: Child[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
}

export function getChildren(): Child[] {
    return getStoredChildren();
}

export function getChildById(id: string): Child | null {
    const children = getStoredChildren();

    return children.find((child) => child.id === id) ?? null;
}

export function createChild(data: {
    age: number;
    sex: ChildSex;
}): Child {
    const children = getStoredChildren();

    const child: Child = {
        id: crypto.randomUUID(),
        screeningId: `CH-${Date.now().toString().slice(-6)}`,
        age: data.age,
        sex: data.sex,
        createdAt: new Date().toISOString(),
    };

    saveChildren([...children, child]);

    return child;
}
