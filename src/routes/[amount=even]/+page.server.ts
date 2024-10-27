import { error } from '@sveltejs/kit';
import type { RouteParams } from './$types.js';
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

// https://svelte.dev/docs/kit/page-options#entries
export function entries(): Array<RouteParams> {
	return range(6, 20, 2).map((amount) => ({ amount: amount.toString() }));
}

function range(start: number, end: number, step: number): number[] {
	const result = [];
	for (let i = start; i < end; i += step) {
		result.push(i);
	}

	return result;
}

export const prerender = true;
