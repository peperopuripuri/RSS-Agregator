import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import onChange from 'on-change';
import i18next from 'i18next';

const translate = (bible, key) => bible.t(key);

function closeModal(modal) {
  modal.classList.remove('show');
}

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

const createInitialPostsSection = (posts, cardPost, cardTitlePost) => {
  posts.insertBefore(cardPost, cardTitlePost.nextSibling);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.insertBefore(ul, cardPost.nextSibling);
};

const createButton = (postTitle, postBody, postLink) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-title', postTitle);
  button.setAttribute('data-body', postBody);
  button.setAttribute('data-link', postLink);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  return button;
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
  link.setAttribute(
    'data-description',
    post.querySelector('description').textContent,
  );
  return link;
};

const getPostData = (post) => {
  const postBody = post.querySelector('description').textContent;
  const postLink = post.querySelector('link').textContent;
  return { postBody, postLink };
};

const getModalData = (buttonn) => {
  const titlee = buttonn.getAttribute('data-title');
  const body = buttonn.getAttribute('data-body');
  const linkk = buttonn.getAttribute('data-link');
  return { titlee, body, linkk };
};

const appendElements = (parent, elements) => {
  elements.forEach((element) => {
    parent.appendChild(element);
  });
};

const createPostItem = (posts, post, postTitle, index) => {
  const ul = posts.querySelector('ul');
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  li.dataset.title = postTitle;

  const { postBody, postLink } = getPostData(post);

  const link = createLink(post, postTitle, index);
  const button = createButton(postTitle, postBody, postLink);
  const modal = document.querySelector('#modal');

  modal.addEventListener('show.bs.modal', (event) => {
    const buttonn = event.relatedTarget;
    const { titlee, body, linkk } = getModalData(buttonn);
    const modall = event.target;
    const modalTitle = modall.querySelector('.modal-title');
    const modalBody = modall.querySelector('.modal-body');
    const modalLink = modall.querySelector('.full-article');
    modalTitle.textContent = titlee;
    modalBody.textContent = body;
    modalLink.href = linkk;
  });

  const btnClose = document.querySelector('.btn-close');
  const btnSecondary = document.querySelector('.btn-secondary');
  btnClose.addEventListener('click', () => closeModal(modal));
  btnSecondary.addEventListener('click', () => closeModal(modal));

  button.addEventListener('click', () => {
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
    link.style.color = 'green';
  });

  appendElements(li, [link, button]);
  ul.insertBefore(li, ul.firstChild);
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
  for (let i = 0; i < postArray.length; i += 1) {
    const postTitle = postArray[i].querySelector('title').textContent;
    const existingPost = posts.querySelector(`a[data-title='${postTitle}']`);
    if (!existingPost) {
      createPostItem(posts, postArray[i], postTitle, i, postArray);
    }
  }
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

const updateFormStatus = (status, feedback, input, customI18next, customTranslate, state) => {
  const { receivedData } = state.urlForm;

  feedback.classList.remove('text-success', 'text-danger');
  input.classList.remove('is-valid', 'is-invalid');
  feedback.textContent = '';

  switch (status) {
    case 'correct':
      input.form.reset();
      input.classList.add('is-valid');
      feedback.classList.add('text-success');
      feedback.textContent = customTranslate(customI18next, 'correct');
      if (receivedData.feeds.length) {
        createFeeds(state);
      }
      if (receivedData.posts.length) {
        createPosts(state);
      }
      break;
    case 'error':
    case 'dublicate':
    case 'parseErr':
    case 'networkErr':
      feedback.textContent = customTranslate(customI18next, status);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      break;
    default:
      break;
  }
};



export const render = (state) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const { urls } = state.urlForm;
  const urlsLength = state.urlForm.urls.length;

  if (urlsLength > 1) urls.splice(0, 1);
  updateFormStatus(
    state.urlForm.status,
    feedback,
    input,
    i18next,
    translate,
    state,
  );
};

export const createWatchedState = (state, rndr) => {
  const watchedState = onChange(state, () => {
    rndr(state);
  });
  return watchedState;
};
