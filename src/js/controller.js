import render from './view';
import state from './model';
import * as yup from "yup";
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';

export const watchedState = onChange(state, render);

i18next.init({
    lng: 'ru',
    resources: {
        ru: {
            translation: {
                correct: 'RSS успешно загружен',
                error: 'Ссылка должна быть валидным URL',
                here: 'RSS уже существует',
                networkErr: 'Проблемы с сетью, попробуйте позже, пожалуйста',
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
                networkErr: 'Problems with the network, try again later, please',
                label: 'link RSS',
                btn: 'Add',
                lead: 'Start to read RSS today! Easy and beautiful.',
                agreg: 'RSS aggregator',
                muted: 'Example: https://ru.hexlet.io/lessons.rss',
            },
        },
    },
});

const translate = (key) => i18next.t(key);

const parse = (data) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(data, 'text/xml');
    const items = Array.from(parsed.querySelectorAll('item'));
    const title = parsed.querySelector('title').textContent;
    const description = parsed.querySelector('description').textContent;
    const postName = Array.from(parsed.querySelectorAll('item title'));
    const postDescription = Array.from(parsed.querySelectorAll('item description'));
    const postLink = Array.from(parsed.querySelectorAll('item link'));
    const postId = Array.from(parsed.querySelectorAll('item guid'));
    return { parsed, items, title, description, postName, postDescription, postLink, postId, };
};

const getData = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then(response => {
        const data = response.data.contents;
        try {
            const { parsed, items, title, description, postName, postDescription, postLink, postId } = parse(data);
            watchedState.receivedData.post.list = items;
            watchedState.receivedData.post.name = postName;
            watchedState.receivedData.post.description = postDescription;
            watchedState.receivedData.post.link = postLink;
            watchedState.receivedData.post.id = postId;
            watchedState.receivedData.title = title;
            watchedState.receivedData.description = description;
            watchedState.urlForm.status = 'correct';
            watchedState.urlForm.translation = translate('correct');
            return parsed;
        } catch (error) {
            console.log('PARSE ERROR:', error);
        };
    })
    .catch(error => {
        console.log('NET ERROR:', error);
        if (error.message === 'Network Error') {
            watchedState.urlForm.status = 'networkErr';
            watchedState.urlForm.translation = translate('networkErr');
        };
    });
};
const validate = (urls) => {
    const url = watchedState.urlForm.url;
    yup
        .object({
            url: yup.string().url().notOneOf(urls),
        })
        .validate({ url })
        .then(value => {
            return getData(value.url);
        })
        .catch(error => {
            console.log(error);
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
    const form = document.querySelector('.rss-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        validate(watchedState.receivedData.urls);
    });
};