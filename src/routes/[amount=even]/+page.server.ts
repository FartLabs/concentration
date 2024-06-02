import { error } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types.js';
import type { SoundData } from '$lib/sounds';
import { SOUNDS_URL } from '$lib/sounds';

export async function load({ fetch, params }: PageServerLoadEvent) {
	const amount = parseInt(params.amount, 10);
	const sounds = (await fetch(SOUNDS_URL).then((r) => r.json())) as SoundData[];
	if (amount < 1 || amount > sounds.length) {
		return error(400, 'Invalid amount');
	}

	return {
		sounds: sounds.sort(() => Math.random() - 0.5).slice(0, amount)
	};
}
