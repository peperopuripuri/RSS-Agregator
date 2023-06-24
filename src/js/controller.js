import * as yup from "yup";
import axios from 'axios';
import { createWatchedState, render } from './view';
import i18next from 'i18next';
import resources from '../resources/resources';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const parseData = (data) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(data, 'text/xml');
    const errorNode = parsed.querySelector("parsererror");

    if (errorNode) {
        return null;
    } else {
        const posts = Array.from(parsed.querySelectorAll('item'));
        const title = parsed.querySelector('title');
        const description = parsed.querySelector('description');
        const feeds = [ title, description ];
        return { parsed, posts, feeds, };
    }
};

const addDomain = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const getData = (url, watchedState) => {
    const urlWithDomain = addDomain(url);
    const updateInterval = 5000;
    const fetchData = () => {
        axios.get(urlWithDomain)
            .then(response => {
                try {
                    const data = response.data.contents;
                    const { parsed, posts, feeds, } = parseData(data, watchedState);
                    watchedState.urlForm.status = 'correct';
                    watchedState.urlForm.urls.push(url);
                    watchedState.urlForm.receivedData.posts = posts;
                    watchedState.urlForm.receivedData.feeds = feeds;
                    return { parsed, posts, feeds, };
                } catch (error) {
                    console.error('PARSE ERROR:', error);
                    watchedState.urlForm.status = 'parseErr';
                };
            })
            .catch(error => {
                console.error('NETWORK ERROR:', error);
                watchedState.urlForm.status = 'networkErr';
            })
        setTimeout(fetchData, updateInterval);
    }
    fetchData();
};

export default () => {
    const state = {
        urlForm: {
            status: null,
            urls: [],
            translation: null,
            receivedData: {
                posts: [],
                feeds: [],
                createdFeeds: false,
                createdPosts: false,
            },
        },
    };
    i18next.init({ lng: 'ru', resources });

    const watchedState = createWatchedState(state, render);
    const form = document.querySelector('.rss-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const url = new FormData(e.target)?.get('url');
        const urls = watchedState.urlForm.urls;
        yup
        .string().url().notOneOf(urls)
        .validate(url)
        .then(() => getData(url, watchedState))
        .catch(error => {
            if (error.message === 'this must be a valid URL') {
                console.error('NOT VALID URL:', error);
                watchedState.urlForm.status = 'error';
            } else if (error.type === 'notOneOf') {
                console.error('DUBLICATE:', error);
                watchedState.urlForm.status = 'dublicate';
            }
        });
    });
};