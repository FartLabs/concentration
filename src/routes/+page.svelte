<script lang="ts">
	import type { PageData } from './$types';
	import Sound from '$lib/components/sound.svelte';
	import { makeSoundURL } from '$lib/sounds';

	export let data: PageData;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
	{#each data.sounds as { sound }}
		<li>
			<Sound src={makeSoundURL(`sounds/${sound}`)} />
			{sound}
		</li>
	{/each}
</ul>
