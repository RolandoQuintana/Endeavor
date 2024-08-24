import { writable } from 'svelte/store';

export const currentView = writable<string>('dashboard');
export const selectedItemId = writable<string | null>(null);
export const selectedItemType = writable<string | null>(null);