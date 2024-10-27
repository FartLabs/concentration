import type { PageServerLoadEvent } from './$types.js';
import type { SoundData } from '$lib/sounds';
import { SOUNDS_URL } from '$lib/sounds';

export async function load({ fetch }: PageServerLoadEvent) {
	return {
		sounds: (await fetch(SOUNDS_URL).then((r) => r.json())) as SoundData[]
	};
}

export const prerender = true;
