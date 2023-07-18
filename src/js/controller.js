import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import {
  closeModal, createWatchedState, getModalData, handleLinkClick, render,
} from './view';
import errors from './errors';
import resources from '../resources/resources';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const parseData = (data) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(data, 'text/xml');
  const parseError = parsed.querySelector('parsererror');

  if (parseError) {
    const h3Element = document.createElement('h3');
    h3Element.textContent = errors.parse;
    parseError.appendChild(h3Element);
    throw parseError;
  }

  const posts = Array.from(parsed.querySelectorAll('item'));
  const title = parsed.querySelector('title');
  const description = parsed.querySelector('description');
  const feeds = [title, description];
  return { parsed, posts, feeds };
};

const addDomain = (url) => new URL(
  `get?disableCache=true&url=${encodeURIComponent(url)}`,
  'https://allorigins.hexlet.app/',
);

const getData = (url, watchedState) => {
  const fetchData = () => {
    const urlWithDomain = addDomain(url);
    axios
      .get(urlWithDomain)
      .then((response) => {
        const data = response.data.contents;
        const { parsed, posts, feeds } = parseData(data, watchedState);
        watchedState.urlForm.urls.push(url);
        watchedState.urlForm.receivedData.posts.push(...posts);
        watchedState.urlForm.receivedData.feeds.push(...feeds);
        return { parsed, posts, feeds };
      })
      .catch((error) => {
        const h3Elements = error.querySelectorAll('h3');
        const errorMessage = h3Elements[2].textContent;
        if (errorMessage === errors.parse) {
          console.error(errors.parse);
          watchedState.urlForm.status = 'parseErr';
        } else {
          console.error(errors.net);
          watchedState.urlForm.status = 'networkErr';
        }
      })
      .finally(() => {
        setTimeout(fetchData, 5000);
      });
  };
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
      modal: {
        status: 'closed',
      },
      link: {
        status: 'notVisited',
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
      .string()
      .url()
      .notOneOf(urls)
      .validate(url)
      .then((success) => {
        if (success) {
          watchedState.urlForm.status = 'correct';
        };
        getData(url, watchedState);

        const postsContainer = document.querySelector('.posts');
        postsContainer.addEventListener('click', (clickEvent) => {
          if (clickEvent.target.tagName === 'A') {
            watchedState.urlForm.link.status = 'visited';
            handleLinkClick(watchedState, clickEvent.target);
          }
          if (clickEvent.target.tagName === 'BUTTON') {
            watchedState.urlForm.link.status = 'visited';
            handleLinkClick(watchedState, clickEvent.target.previousElementSibling);
          }
        });

        const modalWindow = document.querySelector('#modal');
        modalWindow.addEventListener('show.bs.modal', (event) => {
          const buttonn = event.relatedTarget;
          const { titlee, body, linkk } = getModalData(buttonn);
          const modall = event.target;
          const modalTitle = modall.querySelector('.modal-title');
          const modalBody = modall.querySelector('.modal-body');
          const modalLink = modall.querySelector('.full-article');
          modalTitle.textContent = titlee;
          modalBody.textContent = body;
          modalLink.href = linkk;

          const btnClose = document.querySelector('.btn-close');
          const btnSecondary = document.querySelector('.btn-secondary');
          watchedState.urlForm.modal.status = 'opened';

          btnClose.addEventListener('click', () => {
            closeModal(watchedState, modalWindow);
            watchedState.urlForm.modal.status = 'closed';
          });
          btnSecondary.addEventListener('click', () => {
            closeModal(watchedState, modalWindow);
            watchedState.urlForm.modal.status = 'closed';
          });
        });
      })
      .catch((error) => {
        if (error.message === 'this must be a valid URL') {
          console.error(errors.invalid, error.message);
          watchedState.urlForm.status = 'error';
        } else if (error.type === 'notOneOf') {
          console.error(errors.dubble, error.message);
          watchedState.urlForm.status = 'dublicate';
        }
      })
      .finally(() => {
        setTimeout(() => {
          watchedState.urlForm.status = null;
        }, 5000);
      });
  });
};
