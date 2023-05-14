import { input, urls } from './view';
import * as yup from "yup";
import watch from "./view";
import i18next from 'i18next';
import axios from 'axios';
import { get, post } from 'jquery';

const form = document.querySelector('.rss-form');
const watchedState = watch;

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

const parse = (data) => new DOMParser().parseFromString(data, 'text/xml');

const getData = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then(response => {
        const data = response.data.contents;
        const parsed = parse(data);
        const title = parsed.querySelector('title').textContent;
        const description = parsed.querySelector('description').textContent;
        const postName = parsed.querySelector('item title').textContent;
        const postDescription = parsed.querySelector('item description').textContent;
        const postLink = parsed.querySelector('item link').textContent;
        const postId = parsed.querySelector('item guid').textContent;
        watchedState.receivedData.post.name = postName;
        watchedState.receivedData.post.description = postDescription;
        watchedState.receivedData.post.link = postLink;
        watchedState.receivedData.post.id = postId;
        watchedState.receivedData.title = title;
        watchedState.receivedData.description = description;
    });
};

const validate = (url, urls = new Array()) => {
    watchedState.urlForm.url = url;
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
        getData(input.value);
    });
};