import { input, urls } from './view';
import * as yup from "yup";
import watch from "./view";
import i18next from 'i18next';
import axios from 'axios';

const form = document.querySelector('.rss-form');

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
};

const getData = (url) => {
    axios.get(url)
        .then(url => {
            fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error('Network response was not ok.');
                })
                .then(data => data.contents);
        })
};
const parse = (data) => new DOMParser().parseFromString(data, 'text/xml');

const validate = (url, urls = new Array()) => {
    const watchedState = watch;
    watchedState.urlForm.url = url;
    const data = getData(url);
    const parsedData = parse(data);
    console.log(parsedData);
    yup
        .object({
            url: yup.string().url().notOneOf(urls),
        })
        .validate(watchedState.urlForm)
        .then(value => {
            watchedState.urlForm.status = 'correct';
            watchedState.urlForm.translation = translate('correct');
        })
        .catch(error => {
            if (error.message === 'url must be a valid URL') {
                watchedState.urlForm.status = 'error';
                watchedState.urlForm.translation = translate('error');
            } else if (error.inner.length === 0) {
                watchedState.urlForm.status = 'here';
                watchedState.urlForm.translation = translate('here');
            }
        });
};

export default () => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        validate(input.value, urls);
    });
};