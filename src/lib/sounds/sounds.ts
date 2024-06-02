export interface SoundData {
	sound: string;
}

export const SOUNDS_URL = makeSoundURL('sounds.json');

export function makeSoundURL(path: string) {
	return `https://github.com/gddmadoss/movies/raw/main/${path}`;
}
