<script lang="ts">
	import { playAudio } from '$lib/sounds';

	export let src: string;

	// Disable the button while the sound is playing.
	let playing = false;
</script>

<button
	on:click={() => {
		playing = true;
		playAudio(new Audio(src)).finally(() => (playing = false));
	}}
	disabled={playing}
>
	{playing ? '💨' : 'Play'}
</button>
