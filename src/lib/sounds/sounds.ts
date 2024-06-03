export interface SoundData {
	sound: string;
}

export function playSound(data: SoundData) {
	return playAudio(new Audio(makeSoundURL(data)));
}

export function playAudio(audio: HTMLAudioElement): Promise<void> {
	audio.play();

	return new Promise((resolve, reject) => {
		audio.onended = () => resolve();
		audio.onerror = (e) => reject(e);
	});
}

export const SOUNDS_URL = makeURL('sounds.json');

export function makeSoundURL(data: SoundData) {
	return makeURL(`sounds/${data.sound}`);
}

export function makeURL(path: string) {
	return `https://github.com/gddmadoss/movies/raw/main/${path}`;
}
