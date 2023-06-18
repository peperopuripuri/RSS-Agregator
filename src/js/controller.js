import state from './model';
import * as yup from "yup";
import onChange from 'on-change';
import axios from 'axios';
import { render } from './view';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

export const createWatchedState = () => {
    const watchedState = onChange(state, render);
    return watchedState;
};

const parseData = (data) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(data, 'text/xml');
    const errorNode = parsed.querySelector("parsererror");

    if (errorNode) {
        console.error('PARSE ERROR:', error);
        watchedState.urlForm.status = 'parseErr';
    } else {
        const posts = Array.from(parsed.querySelectorAll('item'));
        const title = parsed.querySelector('title');
        const description = parsed.querySelector('description');
        const feeds = [ title, description ];
        return { parsed, posts, feeds, };
    }
};

const getData = (url, watchedState) => {
    const updateInterval = 5000;
    const fetchData = () => {
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
            .then(response => {
                const data = response.data.contents;
                try {
                    const { parsed, posts, feeds, } = parseData(data);
                    watchedState.urlForm.status = 'correct';
                    watchedState.urlForm.urls.push(url);
                    watchedState.urlForm.receivedData.posts = posts;
                    watchedState.urlForm.receivedData.feeds = feeds;
                    console.log('DATA UPDATED');
                    return { parsed, posts, feeds, };
                } catch (error) {
                    console.error('PARSE ERROR:', error);
                    watchedState.urlForm.status = 'parseErr';
                    throw error;
                };
            })
            .catch(error => {
                console.error('NET ERROR');
                watchedState.urlForm.status = 'networkErr';
                throw error;
            });
        setTimeout(fetchData, updateInterval);
    }
    fetchData();
};


export default () => {
    const watchedState = createWatchedState();
    const form = document.querySelector('.rss-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const url = form.elements['url-input'].value;
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