<script lang="ts">
	import type { PageData } from './$types';
	import Sound from '$lib/components/sound.svelte';
	import { makeSoundURL } from '$lib/sounds';

	export let data: PageData;
</script>

<div class="fart-section">
	<p>Study each fart sound carefully.</p>

	<ol>
		{#each data.sounds as { sound }}
			<li>
				<Sound src={makeSoundURL({ sound })} />
				<a href={makeSoundURL({ sound })} download={sound}>[Download]</a>
			</li>
		{/each}
	</ol>
</div>
