import i18next from 'i18next';
import resources from '../resources/resources';
import state from './model';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

i18next.init({ lng: 'ru', resources });

const translate = (key) => i18next.t(key);

export const changeModalData = (title, link, description) => {
    const modalTitle = document.querySelector('.modal-title');
    const modalLink = document.querySelector('.full-article');
    const modalDescription = document.querySelector('.modal-body');
    const myModal = document.querySelector('.modal');
    const modal = new bootstrap.Modal(myModal);
    modal.show();
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalLink.href = link;

    // document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    //     return button.addEventListener('click', changeModalData(postTitle, postLink, postDescription, postId));
    // });
    // modal.setAttribute('id', `modal-${id}`);
    // modal.setAttribute('aria-labelledby', `modal-${id}-label`);
    // modalTitle.textContent = title;
    // modalTitle.setAttribute('id', `modal-${id}`);
    // modalLink.setAttribute('href', link);
    // modalDescription.textContent = description;
}

const createPosts = () => {
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

            const titleSpan = document.createElement('span');
            titleSpan.textContent = postTitle;

            li.appendChild(titleSpan);
            li.appendChild(link);
            li.appendChild(button);
            ul.insertBefore(li, ul.firstChild);
        }
    }
};

const createFeeds = () => {
    const feeds = document.querySelector('.feeds');
    const feedTitle = state.urlForm.receivedData.feeds[0].textContent;
    const feedDescription = state.urlForm.receivedData.feeds[0].textContent;

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

export const render = () => {
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');

    if (state.urlForm.urls.length > 1) state.urlForm.urls.splice(0, 1);
    switch (state.urlForm.status) {
        case 'correct':
            input.form.reset();
            input.classList.remove('is-invalid');
            feedback.classList.remove('text-danger');
            feedback.classList.add('text-success');
            input.classList.add('is-valid');
            feedback.textContent = translate('correct');
            if (state.urlForm.receivedData.feeds.length) {
                createFeeds();
            };
            if (state.urlForm.receivedData.posts.length) {
                createPosts();
            };
            break;
        case 'error':
            feedback.classList.remove('text-success');
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            feedback.classList.add('text-danger');
            feedback.textContent = translate('error');
            break;
        case 'dublicate':
            feedback.classList.remove('text-success');
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            feedback.classList.add('text-danger');
            feedback.textContent = translate('dublicate');
            break;
        case 'parseErr':
            feedback.classList.remove('text-success');
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            feedback.classList.add('text-danger');
            feedback.textContent = translate('parseErr');
            break;
    }
};
