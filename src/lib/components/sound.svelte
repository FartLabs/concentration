<script lang="ts">
	export let src: string;

	// Disable the button while the sound is playing.
	let playing = false;

	function play() {
		if (playing) return;
		playing = true;

		const audio = new Audio(src);
		audio.play();

		audio.onended = () => {
			playing = false;
		};
	}
</script>

<button on:click={() => play()} disabled={playing}>
	{playing ? '💨' : 'Play'}
</button>
