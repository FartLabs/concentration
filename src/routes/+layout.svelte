<svelte:head>
	<title>Fart Concentration</title>
	<link rel="icon" href="https://fart.tools/fl-logo.png" />
</svelte:head>

<div class="fart-section">
	<h1>
		<a href="/" class="fart-link-visible-on-hover">Fart Concentration</a>
	</h1>
</div>

<slot />

<div class="fart-section">
	<hr />

	<footer>
		<p>© FartLabs <a class="fart-logo" href="https://fart.tools">🧪</a></p>
		<a class="fart-button" href="https://fart.tools/blog" target="_blank">Blog<small>↗</small></a>
		<a class="fart-button" href="https://github.com/FartLabs" target="_blank"
			>GitHub<small>↗</small></a
		>
		<a class="fart-button" href="https://go.fart.tools/chat" target="_blank"
			>Chat<small>↗</small></a
		>
	</footer>
</div>

<style>
	footer {
		text-align: center;
	}
</style>
