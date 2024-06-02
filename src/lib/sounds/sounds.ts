export interface SoundData {
	sound: string;
}

export function play(src: string): Promise<void> {
	const audio = new Audio(src);
	audio.play();

	return new Promise((resolve, reject) => {
		audio.onended = () => resolve();
		audio.onerror = (e) => reject(e);
	});
}

export const SOUNDS_URL = makeSoundURL('sounds.json');

export function makeSoundURL(path: string) {
	return `https://github.com/gddmadoss/movies/raw/main/${path}`;
}
