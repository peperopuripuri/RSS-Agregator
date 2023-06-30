import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import onChange from 'on-change';
import i18next from 'i18next';

const translate = (bible, key) => bible.t(key);

function closeModal() {
  modal.classList.remove('show');
  modal.style.display = 'none';
}

const triggerModal = (postArray, i) => {
  const post = postArray[i];
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.full-article');
  const btnClose = document.querySelector('.btn-close');
  const btnSecondary = document.querySelector('.btn-secondary');
  const modal = document.querySelector('#modal');

  modalTitle.textContent = post.querySelector('title').textContent;
  modalBody.textContent = post.querySelector('description').textContent;
  modalLink.href = post.querySelector('link').textContent;

  btnClose.addEventListener('click', closeModal);
  btnSecondary.addEventListener('click', closeModal);

  modal.classList.add('show');
  modal.style.display = 'block';
};

const createCardElement = () => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  return card;
};

const createCardBodyElement = () => {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  return cardBody;
};

const createCardTitleElement = (text) => {
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = text;
  return cardTitle;
};

const createFeedListElement = () => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  return ul;
};

const createFeedListItemElement = (feedTitle, feedDescription) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  li.dataset.title = feedTitle;

  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = feedTitle;

  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = feedDescription;

  li.appendChild(h3);
  li.appendChild(p);

  return li;
};

const createFeedItem = (feeds, feedTitle, feedDescription) => {
  const ul = feeds.querySelector('ul');
  const existingFeed = ul.querySelector(`li[data-title="${feedTitle}"]`);
  if (!existingFeed) {
    const li = createFeedListItemElement(feedTitle, feedDescription);
    ul.insertBefore(li, ul.firstChild);
  }
};

const createFeedSection = (feeds, feedTitle, feedDescription) => {
  const cardFeed = createCardElement();
  const cardBodyFeed = createCardBodyElement();
  const cardTitleFeed = createCardTitleElement('Фиды');

  cardBodyFeed.appendChild(cardTitleFeed);
  cardFeed.appendChild(cardBodyFeed);
  feeds.appendChild(cardFeed);

  const ul = createFeedListElement();
  const li = createFeedListItemElement(feedTitle, feedDescription);

  ul.appendChild(li);
  feeds.appendChild(ul);
};

const createPosts = (state) => {
  const posts = document.querySelector('.posts');
  const cardTitlePost = createCardTitleElement('Посты');
  posts.insertBefore(cardTitlePost, posts.firstChild);

  const cardPost = createCardElement();
  const cardBodyPost = createCardBodyElement();
  cardBodyPost.appendChild(cardTitlePost);
  cardPost.appendChild(cardBodyPost);

  if (!state.urlForm.receivedData.createdPosts) {
    createInitialPostsSection(posts, cardPost, cardTitlePost);
    state.urlForm.receivedData.createdPosts = true;
  }

  const postArray = state.urlForm.receivedData.posts;
  for (let i = 0; i < postArray.length; i++) {
    const postTitle = postArray[i].querySelector('title').textContent;
    const existingPost = posts.querySelector(`a[data-title='${postTitle}']`);
    if (!existingPost) {
      createPostItem(posts, postArray[i], postTitle, i);
    }
  }
};

const createPostItem = (posts, post, postTitle, index) => {
  const ul = posts.querySelector('ul');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  li.dataset.title = postTitle;

  const link = createLink(post, postTitle, index);
  const button = createButton(index);

  button.addEventListener('click', () => {
    triggerModal(postArray, index);
    li.classList.remove('fw-bold');
    li.classList.add('fw-normal');
  });

  li.appendChild(link);
  li.appendChild(button);
  ul.insertBefore(li, ul.firstChild);
};

const createLink = (post, postTitle, index) => {
  const link = document.createElement('a');
  link.href = post.querySelector('link').textContent;
  link.classList.add('fw-bold');
  link.setAttribute('data-id', index);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = postTitle;
  link.setAttribute('data-title', postTitle);
  link.setAttribute('data-link', post.querySelector('link').textContent);
  link.setAttribute('data-description', post.querySelector('description').textContent);
  return link;
};

const createButton = (index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', index);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', `#modal-${index}`);
  button.textContent = 'Просмотр';
  return button;
};

const createInitialPostsSection = (posts, cardPost, cardTitlePost) => {
  posts.insertBefore(cardPost, cardTitlePost.nextSibling);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.insertBefore(ul, cardPost.nextSibling);
};

const createFeeds = (state) => {
  const feeds = document.querySelector('.feeds');
  const feedTitle = state.urlForm.receivedData.feeds[0].textContent;
  const feedDescription = state.urlForm.receivedData.feeds[1].textContent;

  if (state.urlForm.receivedData.createdFeeds) {
    createFeedItem(feeds, feedTitle, feedDescription);
  } else {
    createFeedSection(feeds, feedTitle, feedDescription);
    state.urlForm.receivedData.createdFeeds = true;
  }
};

const updateFormStatus = (status, feedback, input, i18next, translate, state) => {
  feedback.classList.remove('text-success', 'text-danger');
  input.classList.remove('is-valid', 'is-invalid');
  feedback.textContent = '';

  switch (status) {
    case 'correct':
      input.form.reset();
      input.classList.add('is-valid');
      feedback.classList.add('text-success');
      feedback.textContent = translate(i18next, 'correct');
      if (state.urlForm.receivedData.feeds.length) {
        createFeeds(state);
      }
      if (state.urlForm.receivedData.posts.length) {
        createPosts(state);
      }
      break;
    case 'error':
    case 'dublicate':
    case 'parseErr':
    case 'networkErr':
      feedback.textContent = translate(i18next, status);
      break;
  }
};

export const render = (state) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const { urls } = state.urlForm;
  const urlsLength = state.urlForm.urls.length;

  if (urlsLength > 1) urls.splice(0, 1);
  updateFormStatus(state.urlForm.status, feedback, input, i18next, translate, state);
};

export const createWatchedState = (state, render) => {
  const watchedState = onChange(state, () => {
    render(state);
  });
  return watchedState;
};
