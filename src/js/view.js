import onChange from 'on-change';
import state from './model';
import i18next from 'i18next';

export const input = document.querySelector('#url-input');
const label = document.querySelector('label');
const dangerText = document.querySelector('.text-danger');
const btn = document.querySelector('.px-sm-5');
const lead = document.querySelector('.lead');
const agreg = document.querySelector('.display-3');
const muted = document.querySelector('.text-muted');
export const urls = new Array();

export const i18 = (key) => {
    i18next.init({
        lng: 'ru',
        resources: {
            ru: {
                translation: {
                    correct: 'RSS успешно загружен',
                    error: 'Ссылка должна быть валидным URL',
                    here: 'RSS уже существует',
                    label: 'Ссылка RSS',
                    btn: 'Добавить',
                    lead: 'Начните читать RSS сегодня! Это легко, это красиво.',
                    agreg: 'RSS агрегатор',
                    muted: 'Пример: https://ru.hexlet.io/lessons.rss',
                }
            },
            en: {
                translation: {
                    correct: 'RSS successfully loaded',
                    error: 'The link must be a valid URL',
                    here: 'RSS already here',
                    label: 'link RSS',
                    btn: 'Add',
                    lead: 'Start to read RSS today! Easy and beautiful.',
                    agreg: 'RSS aggregator',
                    muted: 'Example: https://ru.hexlet.io/lessons.rss',
                },
            },
        },
    })
    return i18next.t(key);
}
const render = () => {
    if (state.status === 'here') {
        if (urls.length > 1) urls.splice(0, 1);
        dangerText.innerHTML = i18('here');
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    } else if (state.status === 'correct') {
        input.value = '';
        input.classList.remove('is-invalid');
        dangerText.setAttribute('style', 'color: green !important');
        dangerText.innerHTML = i18('correct');
        urls.push(state.urlForm.url);
    } else if (state.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = i18('error');
    }
};

export default onChange(state, render);