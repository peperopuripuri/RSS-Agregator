import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import onChange from 'on-change';
import i18next from 'i18next';

const translate = (bible, key) => bible.t(key);

function closeModal() {
    modal.classList.remove("show");
    modal.style.display = "none";
};

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

    modal.classList.add("show");
    modal.style.display = "block";
};

const createPosts = (state) => {
    const posts = document.querySelector('.posts');
    const cardTitlePost = document.createElement('h2');
    cardTitlePost.classList.add('card-title', 'h4');
    cardTitlePost.textContent = 'Посты';
    posts.insertBefore(cardTitlePost, posts.firstChild);

    const cardPost = document.createElement('div');
    cardPost.classList.add('card', 'border-0');
    const cardBodyPost = document.createElement('div');
    cardBodyPost.classList.add('card-body');
    cardBodyPost.appendChild(cardTitlePost);
    cardPost.appendChild(cardBodyPost);

    if (!state.urlForm.receivedData.createdPosts) {
        posts.insertBefore(cardPost, cardTitlePost.nextSibling);
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'border-0', 'rounded-0');
        posts.insertBefore(ul, cardPost.nextSibling);
        state.urlForm.receivedData.createdPosts = true;
    }

    const postArray = state.urlForm.receivedData.posts;
    for (let i = 0; i < postArray.length; i++) {
        const postTitle = postArray[i].querySelector('title').textContent;
        const existingPost = posts.querySelector(`a[data-title='${postTitle}']`);
        if (!existingPost) {
            const ul = posts.querySelector('ul');
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
            li.dataset.title = postTitle;
            const link = document.createElement('a');
            link.href = postArray[i].querySelector('link').textContent;
            link.classList.add('fw-bold');
            link.setAttribute('data-id', i);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = postTitle;
            link.setAttribute('data-title', postTitle);
            link.setAttribute('data-link', postArray[i].querySelector('link').textContent);
            link.setAttribute('data-description', postArray[i].querySelector('description').textContent);

            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
            button.setAttribute('data-id', i);
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', `#modal-${i}`);
            button.textContent = 'Просмотр';

            button.addEventListener('click', () => {
                triggerModal(postArray, i);
                li.classList.remove('fw-bold');
                li.classList.add('fw-normal');
            });

            const titleSpan = document.createElement('span');
            titleSpan.textContent = postTitle;

            li.appendChild(titleSpan);
            li.appendChild(link);
            li.appendChild(button);
            ul.insertBefore(li, ul.firstChild);
        }
    }
};

const createFeeds = (state) => {
    const feeds = document.querySelector('.feeds');
    const feedTitle = state.urlForm.receivedData.feeds[0].textContent;
    const feedDescription = state.urlForm.receivedData.feeds[1].textContent;

    if (state.urlForm.receivedData.createdFeeds) {
        const ul = feeds.querySelector('ul');
        const existingFeed = ul.querySelector(`li[data-title="${feedTitle}"]`);
        if (!existingFeed) {
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
            ul.insertBefore(li, ul.firstChild);
        }
    } else {
        const cardFeed = document.createElement('div');
        cardFeed.classList.add('card', 'border-0');
        const cardBodyFeed = document.createElement('div');
        cardBodyFeed.classList.add('card-body');
        const cardTitleFeed = document.createElement('h2');
        cardTitleFeed.classList.add('card-title', 'h4');
        cardTitleFeed.textContent = 'Фиды';
        cardBodyFeed.appendChild(cardTitleFeed);
        cardFeed.appendChild(cardBodyFeed);
        feeds.appendChild(cardFeed);
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'border-0', 'rounded-0');
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
        ul.appendChild(li);
        feeds.appendChild(ul);
        state.urlForm.receivedData.createdFeeds = true;
    };
};

const updateFormStatus = (status, feedback, input, i18next, translate, state) => {
    feedback.classList.remove('text-success');
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = '';

    switch (status) {
        case 'correct':
            input.form.reset();
            input.classList.remove('is-invalid');
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            input.classList.add('is-valid');
            feedback.textContent = '';
            feedback.textContent = translate(i18next, 'correct');
            if (state.urlForm.receivedData.feeds.length) {
                createFeeds(state);
            }
            if (state.urlForm.receivedData.posts.length) {
                createPosts(state);
            }
            break;
        case 'error':
            feedback.textContent = translate(i18next, 'error');
            break;
        case 'dublicate':
            feedback.textContent = translate(i18next, 'dublicate');
            break;
        case 'parseErr':
            feedback.textContent = translate(i18next, 'parseErr');
            break;
        case 'networkErr':
            feedback.textContent = translate(i18next, 'networkErr');
            break;
    }
};

export const render = (state) => {
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');
    const urls = state.urlForm.urls;
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