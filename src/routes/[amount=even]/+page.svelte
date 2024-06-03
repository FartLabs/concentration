<script lang="ts">
	import type { PageData } from './$types';
	// import Sound from '$lib/components/sound.svelte';
	// import { makeSoundURL } from '$lib/sounds';
	import Concentration from '$lib/components/concentration.svelte';

	export let data: PageData;
</script>

<!-- Concentration game  -->

<Concentration sounds={data.sounds} />
