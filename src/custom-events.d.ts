declare global {
    interface DocumentEventMap {
        'colorChanged': CustomEvent<{ id: number; color: string }>;
        'endeavorDeleted': CustomEvent;
    }
}

export {};