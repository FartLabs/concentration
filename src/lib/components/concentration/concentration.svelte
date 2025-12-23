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
	:root {
		--txt-1: hsl(220 10% 98%);
	}

	section {
		height: 100%;
		display: grid;
		place-content: center;
		padding-bottom: 2rem;
	}

	h1 {
		font-size: 4rem;
		text-align: center;
		text-transform: capitalize;
	}

	button {
		padding: 1.5rem;
		font-size: 2rem;
		font-weight: 900;
		background: none;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		display: flex;
		place-items: center;
		justify-content: center;
		font-family: 'Overpass', sans-serif;
	}

	.board {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.row {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.card {
		height: 140px;
		width: 140px;
		font-size: 4rem;
		background-color: var(--fart-lighter-dark-green);
		transition: rotate 0.3s ease-out;
		transform-style: preserve-3d;

		&.selected {
			border: 4px solid var(--fart-green);
		}

		&.flip {
			rotate: y 180deg;
			pointer-events: none;
		}

		& .back {
			position: absolute;
			inset: 0;
			display: grid;
			place-content: center;
			backface-visibility: hidden;
			rotate: y 180deg;
		}

		& .match {
			transition: opacity 0.3s ease-out;
			opacity: 0.4;
			background-color: var(--fart-darker-dark-green);
		}
	}

	.timer {
		transition: color 0.3s ease;
		text-align: center;
	}
</style>
