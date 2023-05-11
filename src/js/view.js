import onChange from 'on-change';
import state from './model';
import i18next from 'i18next';

export const input = document.querySelector('#url-input');
const dangerText = document.querySelector('.text-danger');
export const urls = new Array();

const translate = (key) => {
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
            // en: {
            //     translation: {
            //         correct: 'RSS successfully loaded',
            //         error: 'The link must be a valid URL',
            //         here: 'RSS already here',
            //         label: 'link RSS',
            //         btn: 'Add',
            //         lead: 'Start to read RSS today! Easy and beautiful.',
            //         agreg: 'RSS aggregator',
            //         muted: 'Example: https://ru.hexlet.io/lessons.rss',
            //     },
            // },
        },
    })
    return i18next.t(key);
}
const render = () => {
    if (state.status === 'here') {
        if (urls.length > 1) urls.splice(0, 1);
        dangerText.innerHTML = translate('here');
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    } else if (state.status === 'correct') {
        input.value = '';
        input.classList.remove('is-invalid');
        dangerText.setAttribute('style', 'color: green !important');
        dangerText.innerHTML = translate('correct');
        urls.push(state.urlForm.url);
    } else if (state.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = translate('error');
    }
};

export default onChange(state, render);