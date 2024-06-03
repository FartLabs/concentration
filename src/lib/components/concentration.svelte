<script lang="ts">
	import { browser } from '$app/environment';
	import type { SoundData } from '$lib/sounds';
	import { makeSoundURL, playAudio } from '$lib/sounds';

	type State = 'start' | 'playing' | 'paused' | 'won';

	export let sounds: SoundData[] = [];

	let state: State = 'start';
	let size = sounds.length;
	let grid = createGrid();
	let maxMatches = grid.length / 2;
	let selected: number[] = [];
	let matches: string[] = [];
	let timerId: number | null = null;
	let time = 0;
	let winTime = 0;

	$: audios = browser ? audiosFromGrid(grid) : [];

	function audiosFromGrid(grid: string[]) {
		return grid.map((sound) => new Audio(makeSoundURL({ sound })));
	}

	function createGrid() {
		// only want unique cards
		let cards = new Set<string>();
		// half because we duplicate the cards
		let maxSize = size / 2;

		while (cards.size < maxSize) {
			// pick random values
			const randomIndex = Math.floor(Math.random() * sounds.length);
			cards.add(sounds[randomIndex].sound);
		}

		// duplicate and shuffle cards
		return shuffle([...cards, ...cards]);
	}

	function shuffle<T>(array: T[]) {
		return array.sort(() => Math.random() - 0.5);
	}

	function startGameTimer() {
		function countdown() {
			if (state === 'paused') {
				return;
			}

			time += 1;
		}

		timerId = setInterval(countdown, 1000);
	}

	function selectCard(cardIndex: number) {
		selected = selected.concat(cardIndex);
		playAudio(audios[cardIndex]);
	}

	function matchCards() {
		// array destructuring can have any name for the values
		const [first, second] = selected;

		if (grid[first] === grid[second]) {
			matches = matches.concat(grid[first]);
		}

		// clear selected
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
		if (timerId) {
			clearInterval(timerId);
		}

		grid = createGrid();
		maxMatches = grid.length / 2;
		selected = [];
		matches = [];
		timerId = null;
		time = 0;
	}

	function gameWon() {
		state = 'won';
		winTime = time;
		resetGame();
	}

	$: if (state === 'playing' && !timerId) {
		startGameTimer();
	}

	$: if (selected.length === 2) {
		matchCards();
	}

	$: if (maxMatches === matches.length) {
		gameWon();
	}
</script>

<svelte:window on:keydown={pauseGame} />

<main>
	{#if state === 'start'}
		<h1>Matching game</h1>
		<button on:click={() => (state = 'playing')}>Play</button>
	{/if}

	{#if state === 'paused'}
		<h1>Game paused</h1>
	{/if}

	{#if state === 'playing'}
		<h1 class="timer" class:pulse={time <= 10}>
			{time}
		</h1>

		<div class="cards">
			{#each grid as card, cardIndex}
				{@const isSelected = selected.includes(cardIndex)}
				{@const isSelectedOrMatch = selected.includes(cardIndex) || matches.includes(card)}
				{@const match = matches.includes(card)}

				<button
					class="card"
					class:selected={isSelected}
					class:flip={isSelectedOrMatch}
					disabled={isSelectedOrMatch}
					on:click={() => selectCard(cardIndex)}
				>
					<div class="back" class:match>💨</div>
				</button>
			{/each}
		</div>
	{/if}

	{#if state === 'won'}
		<h1>You won in {winTime} seconds!</h1>
		<button on:click={() => (state = 'playing')}>Play again</button>
	{/if}
</main>

<style>
	/* @import '@fontsource/poppins'; */
	/* TODO: Customize colors and font family. */
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

	:root {
		--txt-1: hsl(220 10% 98%);
		--bg-1: hsl(220 20% 10%);
		--bg-2: hsl(220 20% 20%);
		--border: hsl(180 100% 50%);
		--pulse: hsl(9 100% 64%);
	}

	main {
		height: 100%;
		display: grid;
		place-content: center;
		padding: 2rem;
		font-family: 'Poppins', sans-serif;
		color: var(--txt-1);
		background-color: var(--bg-1);
	}

	h1 {
		font-size: 4rem;
		text-align: center;
		text-transform: capitalize;
	}

	h1 + button {
		width: max-content;
		margin-top: 2rem;
		margin-inline: auto;
		border: 4px solid var(--border);
	}

	button {
		padding: 1.5rem;
		font-size: 2rem;
		font-weight: 900;
		color: inherit;
		background: none;
		border-radius: 8px;
		border: none;
		text-transform: uppercase;
		cursor: pointer;
	}

	.cards {
		display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
		gap: 0.5rem;
	}

	.card {
		height: 140px;
		width: 140px;
		font-size: 4rem;
		background-color: var(--bg-2);
		transition: rotate 0.3s ease-out;
		transform-style: preserve-3d;

		&.selected {
			border: 4px solid var(--border);
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
		}
	}

	.timer {
		transition: color 0.3s ease;
	}

	.pulse {
		color: var(--pulse);
		animation: pulse 1s infinite ease;
	}

	@keyframes pulse {
		to {
			scale: 1.4;
		}
	}
</style>
