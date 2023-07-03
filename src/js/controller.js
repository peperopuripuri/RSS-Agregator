import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { createWatchedState, render } from './view';
import errors from './errors';
import resources from '../resources/resources';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { data } from 'jquery';

const parseData = (data) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(data, 'text/xml');
  const parseError = parsed.querySelector('parsererror');

  if (parseError) {
    throw new Error(errors.parse);
  } else {
    const posts = Array.from(parsed.querySelectorAll('item'));
    const title = parsed.querySelector('title');
    const description = parsed.querySelector('description');
    const feeds = [title, description];
    return { parsed, posts, feeds };
  }
};

const addDomain = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const getData = (url, watchedState) => {
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
      if (error.message === errors.parse) {
        console.error(errors.parse, error.message);
        watchedState.urlForm.status = 'parseErr';
      } else {
        console.error(errors.net, error.message);
        watchedState.urlForm.status = 'networkErr';
      }
    });
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
    const url = new FormData(e.target)?.get('url');
    const { urls } = watchedState.urlForm;
    yup
      .string().url().notOneOf(urls)
      .validate(url)
      .then(() => getData(url, watchedState))
      .then (() => setTimeout(getData(url, watchedState), 5000))
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
