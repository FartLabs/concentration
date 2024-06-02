import type { ParamMatcher } from '@sveltejs/kit';

match satisfies ParamMatcher;

/**
 * match matches even numbers.
 */
export function match(param: string) {
	return parseInt(param, 10) % 2 === 0;
}
