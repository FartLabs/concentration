<script lang="ts">
	import type { SoundData } from '$lib/sounds';
	import { playAudio } from '$lib/sounds';
	import { onMount } from 'svelte';
	import type { ConcentrationState } from './concentration';
	import { createGrid, audiosFromGrid } from './concentration';

	export let sounds: SoundData[] = [];

	let state: ConcentrationState = 'start';
	let grid = createGrid(sounds);
	let maxMatches = grid.length / 2;
	let selected: number[] = [];
	let matches: string[] = [];
	let timerID: number | null = null;
	let time = 0;
	let winTime = 0;
	let audios: HTMLAudioElement[] = [];

	onMount(() => {
		audios = audiosFromGrid(grid);
	});

	function startGameTimer() {
		function countdown() {
			if (state === 'paused') {
				return;
			}

			time += 1;
		}

		timerID = setInterval(countdown, 1000);
	}

	function selectCard(cardIndex: number) {
		selected = selected.concat(cardIndex);
		playAudio(audios[cardIndex]);
	}

	function matchCards() {
		const [first, second] = selected;

		if (grid[first] === grid[second]) {
			matches = matches.concat(grid[first]);
		}

		setTimeout(() => (selected = []), 300);
	}

	function pauseGame(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			switch (state) {
				case 'playing': {
					state = 'paused';
					break;
				}

				case 'paused': {
					state = 'playing';
					break;
				}
			}
		}
	}

	function resetGame() {
		if (timerID) {
			clearInterval(timerID);
		}

		grid = createGrid(sounds);
		audios = audiosFromGrid(grid);
		maxMatches = grid.length / 2;
		selected = [];
		matches = [];
		timerID = null;
		time = 0;
	}

	function gameWon() {
		state = 'won';
		winTime = time;
		resetGame();
	}

	$: if (state === 'playing' && !timerID) {
		startGameTimer();
	}

	$: if (selected.length === 2) {
		matchCards();
	}

	$: if (maxMatches === matches.length) {
		gameWon();
	}
	// Determine number of columns based on total cards for a balanced grid
	// 6 cards -> 3x2
	// 8 cards -> 4x2
	// 10 cards -> 4+4+2
	// 12 cards -> 4x3
	// 16 cards -> 4x4
	// 20 cards -> 5x4
	const GRID_LAYOUTS: Record<number, number[]> = {
		6: [3, 3],
		8: [4, 4],
		10: [4, 4, 2],
		12: [4, 4, 4],
		16: [4, 4, 4, 4],
		20: [5, 5, 5, 5]
	};

	let rows: { card: string; index: number }[][] = [];

	$: {
		const layout = GRID_LAYOUTS[grid.length] ?? [];
		const gridWithIndices = grid.map((card, index) => ({ card, index }));

		if (layout.length > 0) {
			let currentIndex = 0;
			rows = layout.map((count) => {
				const row = gridWithIndices.slice(currentIndex, currentIndex + count);
				currentIndex += count;
				return row;
			});
		} else {
			// Fallback to chunks of 4 if no layout is defined
			rows = [];
			for (let i = 0; i < gridWithIndices.length; i += 4) {
				rows.push(gridWithIndices.slice(i, i + 4));
			}
		}
	}
</script>

<svelte:window on:keydown={pauseGame} />

<section>
	{#if state === 'start'}
		<button on:click={() => (state = 'playing')} class="fart-link-visible-on-hover">Play</button>
	{/if}

	{#if state === 'paused'}
		<h1>Game paused</h1>
	{/if}

	{#if state === 'playing'}
		<p class="timer">Seconds: {time}</p>
	{:else if state === 'won'}
		<p class="timer">You won in {winTime} seconds!</p>
	{/if}

	{#if state === 'playing'}
		<div class="board">
			{#each rows as row}
				<div class="row">
					{#each row as { card, index } (index)}
						{@const isSelected = selected.includes(index)}
						{@const isSelectedOrMatch = selected.includes(index) || matches.includes(card)}
						{@const match = matches.includes(card)}

						<button
							class="card"
							class:selected={isSelected}
							class:flip={isSelectedOrMatch}
							disabled={isSelectedOrMatch}
							on:click={() => selectCard(index)}
						>
							<div class="back" class:match>💨</div>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{/if}

	{#if state === 'won'}
		<button on:click={() => (state = 'playing')} class="fart-link-visible-on-hover"
			>Play again</button
		>
	{/if}
</section>

<style>
	/* Design Tokens */
	:root {
		/* Spacing Scale */
		--spacing-xs: 0.5rem;
		--spacing-sm: 0.75rem;
		--spacing-md: 1rem;
		--spacing-md-lg: 1.25rem;
		--spacing-lg: 1.5rem;
		--spacing-xl: 2rem;

		/* Typography Scale - Mobile (base) */
		--font-size-timer-mobile: clamp(1rem, 4vw, 1.5rem);
		--font-size-heading-mobile: 2rem;
		--font-size-button-mobile: 1.25rem;
		--font-size-card-mobile: clamp(2rem, 8vw, 4rem);

		/* Typography Scale - Tablet (480px+) */
		--font-size-heading-tablet: 3rem;
		--font-size-button-tablet: 1.5rem;

		/* Typography Scale - Desktop (768px+) */
		--font-size-heading-desktop: 4rem;
		--font-size-button-desktop: 2rem;
		--font-size-card-desktop: 4rem;
		--font-size-timer-desktop: 1.5rem;

		/* Card Dimensions */
		--card-size-min: 80px;
		--card-size-max: 140px;
		--card-size-responsive: clamp(var(--card-size-min), 20vw, var(--card-size-max));

		/* Border */
		--border-radius: 8px;
		--border-width-min: 2px;
		--border-width-max: 4px;
		--border-width-responsive: clamp(var(--border-width-min), 1vw, var(--border-width-max));

		/* Transitions */
		--transition-fast: 0.3s ease-out;
		--transition-base: 0.3s ease;

		/* Opacity */
		--opacity-disabled: 0.4;
	}

	/* Base Styles */
	section {
		height: 100%;
		display: grid;
		place-content: center;
		padding: var(--spacing-md);
		padding-bottom: var(--spacing-xl);
		box-sizing: border-box;
	}

	/* Component: Timer */
	.timer {
		transition: color var(--transition-base);
		text-align: center;
		font-size: var(--font-size-timer-mobile);
		margin-bottom: var(--spacing-md);
	}

	/* Component: Heading */
	section h1 {
		font-size: var(--font-size-heading-mobile);
		text-align: center;
		text-transform: capitalize;
	}

	/* Component: Button (base) */
	section button {
		padding: var(--spacing-md);
		font-size: var(--font-size-button-mobile);
		font-weight: 900;
		background: none;
		border-radius: var(--border-radius);
		border: none;
		cursor: pointer;
		display: flex;
		place-items: center;
		justify-content: center;
		font-family: 'Overpass', sans-serif;
	}

	/* Component: Board */
	.board {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		width: 100%;
		max-width: 100%;
	}

	/* Component: Row */
	.row {
		display: flex;
		justify-content: center;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
		width: 100%;
	}

	/* Component: Card */
	.card {
		height: var(--card-size-responsive);
		width: var(--card-size-responsive);
		min-height: var(--card-size-min);
		min-width: var(--card-size-min);
		font-size: var(--font-size-card-mobile);
		background-color: var(--fart-lighter-dark-green);
		transition: rotate var(--transition-fast);
		transform-style: preserve-3d;
		position: relative;
		flex-shrink: 0;
	}

	.card.selected {
		border: var(--border-width-responsive) solid var(--fart-green);
	}

	.card.flip {
		rotate: y 180deg;
		pointer-events: none;
	}

	.card .back {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		backface-visibility: hidden;
		rotate: y 180deg;
	}

	.card .back.match {
		transition: opacity var(--transition-fast);
		opacity: var(--opacity-disabled);
		background-color: var(--fart-darker-dark-green);
	}

	/* Responsive: Tablet and up (480px+) */
	@media (min-width: 480px) {
		section h1 {
			font-size: var(--font-size-heading-tablet);
		}

		section button {
			padding: var(--spacing-md-lg);
			font-size: var(--font-size-button-tablet);
		}

		.board {
			gap: var(--spacing-sm);
		}

		.row {
			gap: var(--spacing-sm);
		}
	}

	/* Responsive: Desktop (768px+) */
	@media (min-width: 768px) {
		section {
			padding: var(--spacing-xl);
		}

		section h1 {
			font-size: var(--font-size-heading-desktop);
		}

		section button {
			padding: var(--spacing-lg);
			font-size: var(--font-size-button-desktop);
		}

		.card {
			height: var(--card-size-max);
			width: var(--card-size-max);
			font-size: var(--font-size-card-desktop);
		}

		.card.selected {
			border: var(--border-width-max) solid var(--fart-green);
		}

		.timer {
			font-size: var(--font-size-timer-desktop);
		}
	}
</style>
