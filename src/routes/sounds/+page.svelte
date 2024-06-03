<script lang="ts">
	import type { PageData } from './$types';
	import Sound from '$lib/components/sound.svelte';
	import { makeSoundURL } from '$lib/sounds';

	export let data: PageData;
</script>

<h2>Take a look at the sounds:</h2>

<ul>
	{#each data.sounds as { sound }}
		<li>
			<Sound src={makeSoundURL({ sound })} />
			{sound}
		</li>
	{/each}
</ul>
