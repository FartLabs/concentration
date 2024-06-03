<script lang="ts">
	import type { PageData } from './$types';
	import Sound from '$lib/components/sound.svelte';
	import { makeSoundURL } from '$lib/sounds';

	export let data: PageData;
</script>

<h1>Welcome to Fart Concentration</h1>
<p>
	Visit the <a href="https://github.com/EthanThatOneKid/fart-concentration">GitHub repository</a> to
	learn more.
</p>

<h2>Play a game:</h2>

<ul>
	<li>
		<a href="/12">12 cards</a>
	</li>

	<li>
		<a href="/16">16 cards</a>
	</li>

	<li>
		<a href="/20">20 cards</a>
	</li>
</ul>

<h2>Take a look at the sounds:</h2>

<ul>
	{#each data.sounds as { sound }}
		<li>
			<Sound src={makeSoundURL({ sound })} />
			{sound}
		</li>
	{/each}
</ul>
