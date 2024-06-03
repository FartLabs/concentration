<script lang="ts">
	import type { PageData } from './$types';
	import Concentration from '$lib/components/concentration/concentration.svelte';

	export let data: PageData;
</script>

<Concentration sounds={data.sounds} />
