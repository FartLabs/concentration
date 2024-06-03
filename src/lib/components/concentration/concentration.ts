import type { SoundData } from '$lib/sounds';
import { makeSoundURL } from '$lib/sounds';

export type ConcentrationState = 'start' | 'playing' | 'paused' | 'won';

export function audiosFromGrid(grid: string[]) {
	return grid.map((sound) => new Audio(makeSoundURL({ sound })));
}

export function createGrid(sounds: SoundData[]) {
	const cards = new Set<string>();
	const maxSize = sounds.length / 2;
	while (cards.size < maxSize) {
		const randomIndex = Math.floor(Math.random() * sounds.length);
		cards.add(sounds[randomIndex].sound);
	}

	return shuffle([...cards, ...cards]);
}

export function shuffle<T>(array: T[]) {
	return array.sort(() => Math.random() - 0.5);
}
