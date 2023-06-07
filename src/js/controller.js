import state from './model';
import * as yup from "yup";
import onChange from 'on-change';
import axios from 'axios';
import { getInputValue, render, changeModalData } from './view';

export const createWatchedState = () => {
    const watchedState = onChange(state, render);
    return watchedState;
};

const parseData = (data) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(data, 'text/xml');
    const posts = Array.from(parsed.querySelectorAll('item'));
    const title = parsed.querySelector('title');
    const description = parsed.querySelector('description');
    const feeds = [ title, description ];
    return { parsed, posts, feeds, };
};

const getData = (url, watchedState) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then(response => {
        const data = response.data.contents;
        try {
            const { parsed, posts, feeds, } = parseData(data);
            watchedState.urlForm.status = 'correct';
            watchedState.urlForm.urls.push(url);
            watchedState.urlForm.receivedData.posts = posts;
            watchedState.urlForm.receivedData.feeds = feeds;
            return { parsed, posts, feeds, };
        } catch (error) {
            console.error('PARSE ERROR:', error);
            watchedState.urlForm.status = 'parseErr';
            throw error;
        };
    })
    .catch(error => {
        console.error('NET ERROR:', error);
        watchedState.urlForm.status = 'networkErr';
        throw error;
    });
};

export default (watchedState = createWatchedState()) => {
    const form = document.querySelector('.rss-form');
    form.addEventListener('submit', e => {
        const url = getInputValue();
        const urls = watchedState.urlForm.urls;
        e.preventDefault();
        yup
        .string().url().notOneOf(urls)
        .validate(url)
        .then(() => {
            // const link = document.querySelector('.fw-bold');
            // const postId = link.getAttribute('data-id');
            // const postTitle = link.getAttribute('data-title');
            // const postLink = link.getAttribute('data-link');
            // const postDescription = link.getAttribute('data-description');

            // document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
            //     return button.addEventListener('click', changeModalData(postTitle, postLink, postDescription, postId));
            // });
            return getData(url, watchedState)
        })
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