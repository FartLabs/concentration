<script lang="ts">
	import { browser } from '$app/environment';
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
</script>

<svelte:window on:keydown={pauseGame} />

<section>
	{#if state === 'start'}
		<button on:click={() => (state = 'playing')} class="page-link-visible-on-hover">Play</button>
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
		<button on:click={() => (state = 'playing')} class="page-link-visible-on-hover"
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
	}

	.cards {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.card {
		height: 140px;
		width: 140px;
		font-size: 4rem;
		background-color: var(--darker-dark-green);
		transition: rotate 0.3s ease-out;
		transform-style: preserve-3d;

		&.selected {
			border: 4px solid var(--green);
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
		text-align: center;
	}
</style>
