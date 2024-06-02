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

<ul>
	{#each data.sounds as { sound }}
		<li>
			<Sound src={makeSoundURL(`sounds/${sound}`)} />
			{sound}
		</li>
	{/each}
</ul>
