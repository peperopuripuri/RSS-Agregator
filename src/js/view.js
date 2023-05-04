import onChange from 'on-change';

export const watchedObj = onChange({ rss: '' }, (key, value) => console.log(`${key}: ${value}`));