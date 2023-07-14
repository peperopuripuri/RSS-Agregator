import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { createWatchedState, render } from './view';
import errors from './errors';
import resources from '../resources/resources';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const parseData = (data) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(data, 'text/xml');
  const parseError = parsed.querySelector('parsererror');

  if (parseError) {
    throw parseError.querySelector('h3').textContent = errors.parse;
  }

  const posts = Array.from(parsed.querySelectorAll('item'));
  const title = parsed.querySelector('title');
  const description = parsed.querySelector('description');
  const feeds = [title, description];
  return { parsed, posts, feeds };
};

const addDomain = (url) => new URL(`get?disableCache=true&url=${encodeURIComponent(url)}`, 'https://allorigins.hexlet.app/');

const getData = (url, watchedState) => {
  const fetchData = () => {
    const urlWithDomain = addDomain(url);
    axios.get(urlWithDomain)
      .then((response) => {
        const data = response.data.contents;
        const { parsed, posts, feeds } = parseData(data, watchedState);
        watchedState.urlForm.status = 'correct';
        watchedState.urlForm.urls.push(url);
        watchedState.urlForm.receivedData.posts = posts;
        watchedState.urlForm.receivedData.feeds = feeds;
        return { parsed, posts, feeds };
      })
      .catch((error) => {
        if (error === errors.parse) {
          console.error(errors.parse);
          watchedState.urlForm.status = 'parseErr';
        } else {
          console.error(errors.net);
          watchedState.urlForm.status = 'networkErr';
        }
      });
  };
  fetchData();
  setTimeout(() => fetchData(), 5000);
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new FormData(e.target).get('url');
    const { urls } = watchedState.urlForm;
    yup
      .string().url().notOneOf(urls)
      .validate(url)
      .then(() => {
        getData(url, watchedState);
      })
      .catch((error) => {
        if (error.message === 'this must be a valid URL') {
          console.error(errors.invalid, error.message);
          watchedState.urlForm.status = 'error';
        } else if (error.type === 'notOneOf') {
          console.error(errors.dubble, error.message);
          watchedState.urlForm.status = 'dublicate';
        }
      });
  });
};
