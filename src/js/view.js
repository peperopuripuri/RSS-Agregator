import { watchedState } from "./controller";


const input = document.querySelector('#url-input');
input.addEventListener("input", () => {
    watchedState.urlForm.url = input.value;
});

export default () => {
    const dangerText = document.querySelector('.text-danger');
    const posts = document.querySelector('.posts');
    const feeds = document.querySelector('.feeds');
    const modal = document.querySelector('#modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-body');
    const modalLink = document.querySelector('.full-article');

    if (watchedState.receivedData.urls.length > 1) watchedState.receivedData.urls.splice(0, 1);
    if (watchedState.urlForm.status === 'here') {
        dangerText.innerHTML = watchedState.urlForm.translation;
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    }  else if (watchedState.urlForm.status === 'networkErr') {
        dangerText.innerHTML = watchedState.urlForm.translation;
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    }
    else if (watchedState.urlForm.status === 'correct') {
        input.classList.remove('is-invalid');
        dangerText.setAttribute('style', 'color: green !important');
        dangerText.innerHTML = watchedState.urlForm.translation;
        const card = document.createElement('div');
        card.classList.add('card', 'border-0');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title', 'h4');
        cardTitle.textContent = 'Посты';
        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        const posts = document.querySelector('#posts');
        posts.appendChild(card);
        for (let i = 0; i < watchedState.receivedData.post.name.length; i++) {
            const postId = watchedState.receivedData.post.id[i].textContent;
            const ul = document.createElement('ul');
            ul.classList.add('list-group', 'border-0', 'rounded-0');
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
            const link = document.createElement('a');
            link.href = watchedState.receivedData.post.link[i].textContent;
            link.classList.add('fw-bold');
            link.setAttribute('data-id', postId);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = watchedState.receivedData.post.name[i].textContent;
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
            button.setAttribute('data-id', postId);
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', `#modal-${postId}`);
            button.textContent = 'Просмотр';
            li.appendChild(link);
            li.appendChild(button);
            ul.appendChild(li);
            const posts = document.querySelector('#posts');
            posts.appendChild(ul);
        };
        const cardFeed = document.createElement('div');
        card.classList.add('card', 'border-0');
        const cardBodyFeed = document.createElement('div');
        cardBodyFeed.classList.add('card-body');
        const cardTitleFeed = document.createElement('h2');
        cardTitleFeed.classList.add('card-title', 'h4');
        cardTitleFeed.textContent = 'Фиды';
        cardBodyFeed.appendChild(cardTitleFeed);
        card.appendChild(cardBodyFeed);
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'border-0', 'rounded-0');
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');
        const h3 = document.createElement('h3');
        h3.classList.add('h6', 'm-0');
        h3.textContent = watchedState.receivedData.title;
        const p = document.createElement('p');
        p.classList.add('m-0', 'small', 'text-black-50');
        p.textContent = watchedState.receivedData.description;
        li.appendChild(h3);
        li.appendChild(p);
        ul.appendChild(li);
        const feeds = document.querySelector('#feeds');
        feeds.appendChild(cardFeed);
        feeds.appendChild(ul);
        watchedState.receivedData.urls.push(watchedState.urlForm.url);
    } else if (watchedState.urlForm.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = watchedState.urlForm.translation;
    }
};