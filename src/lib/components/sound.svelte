<script lang="ts">
	import { play } from '$lib/sounds';

	export let src: string;

	// Disable the button while the sound is playing.
	let playing = false;
</script>

<button
	on:click={() => {
		playing = true;
		play(src).finally(() => (playing = false));
	}}
	disabled={playing}
>
	{playing ? '💨' : 'Play'}
</button>
