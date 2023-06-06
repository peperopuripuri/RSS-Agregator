import i18next from 'i18next';
import resources from '../resources/resources';
import state from './model';

i18next.init({ lng: 'ru', resources });

const translate = (key) => i18next.t(key);

export const getInputValue = () => document.querySelector('#url-input').value;

export const changeModalData = (title, link, description) => {
    const modalTitle = document.querySelector('.modal-title');
    const modalLink = document.querySelector('.full-article');
    const modalDescription = document.querySelector('.modal-body');

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalLink.href = link;


    // modal.setAttribute('id', `modal-${id}`);
    // modal.setAttribute('aria-labelledby', `modal-${id}-label`);
    // modalTitle.textContent = title;
    // modalTitle.setAttribute('id', `modal-${id}`);
    // modalLink.setAttribute('href', link);
    // modalDescription.textContent = description;
}

const createPosts = () => {
    const posts = document.querySelector('.posts');

    const cardPost = document.createElement('div');
    cardPost.classList.add('card', 'border-0');
    const cardBodyPost = document.createElement('div');
    cardBodyPost.classList.add('card-body');
    const cardTitlePost = document.createElement('h2');
    cardTitlePost.classList.add('card-title', 'h4');
    cardTitlePost.textContent = 'Посты';
    cardBodyPost.appendChild(cardTitlePost);
    cardPost.appendChild(cardBodyPost);
    posts.appendChild(cardPost);

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    for (let i = 0; i < state.urlForm.receivedData.posts.length; i++) {
        const postId = i;
        const postTitle = state.urlForm.receivedData.posts[i].querySelector('title').textContent;
        const postLink = state.urlForm.receivedData.posts[i].querySelector('link').textContent;
        const postDescription = state.urlForm.receivedData.posts[i].querySelector('description').textContent;

        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

        const link = document.createElement('a');
        link.href = postLink;
        link.classList.add('fw-bold');
        link.setAttribute('data-id', postId);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = postTitle;
        link.setAttribute('data-title', postTitle);
        link.setAttribute('data-link', postLink);
        link.setAttribute('data-description', postDescription);


        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        button.setAttribute('data-id', postId);
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', `#modal-${postId}`);
        button.textContent = 'Просмотр';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = postTitle;

        listItem.appendChild(titleSpan);
        listItem.appendChild(link);
        listItem.appendChild(button);
        postsList.appendChild(listItem);
    };
    if (state.urlForm.receivedData.createdPosts) {
        const postsListOld = posts.querySelector('.list-group');
        const cardPostOld = posts.querySelector('.card');
        posts.replaceChild(cardPost, cardPostOld);
        posts.replaceChild(postsList, postsListOld);
    } else {
        posts.appendChild(postsList);
        state.urlForm.receivedData.createdPosts = true;
    }
};

const createFeed = () => {
    const feeds = document.querySelector('.feeds');
    const feedTitle = state.urlForm.receivedData.feeds[0].textContent;
    const feedDescription = state.urlForm.receivedData.feeds[0].textContent;

    if (state.urlForm.receivedData.createdFeeds) {
        const ul = feeds.querySelector('ul');
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');
        const h3 = document.createElement('h3');
        h3.classList.add('h6', 'm-0');
        h3.textContent = feedTitle;
        const p = document.createElement('p');
        p.classList.add('m-0', 'small', 'text-black-50');
        p.textContent = feedDescription;
        li.appendChild(h3);
        li.appendChild(p);
        const oldLi = ul.querySelector('li');
        ul.replaceChild(li, oldLi);
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
                createFeed();
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
