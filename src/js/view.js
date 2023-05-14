import onChange from 'on-change';
import state from './model';

const dangerText = document.querySelector('.text-danger');
const posts = document.querySelector('.posts');
const feeds = document.querySelector('.feeds');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-body');
export const input = document.querySelector('#url-input');
export const urls = new Array();

const render = () => {
    if (state.urlForm.status === 'here') {
        if (urls.length > 1) urls.splice(0, 1);
        dangerText.innerHTML = state.urlForm.translation;
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    } else if (state.urlForm.status === 'correct') {
        input.value = '';
        input.classList.remove('is-invalid');
        dangerText.setAttribute('style', 'color: green !important');
        dangerText.innerHTML = state.urlForm.translation;
        modalTitle.innerHTML = `
            <h5 class="modal-title">${state.receivedData.post.name}</h5>
        `;
        modalDescription.innerHTML = `
            <div class="modal-body text-break">${state.receivedData.post.description}</div>
        `;
        posts.innerHTML = `
            <div class="card border-0">
                <div class="card-body">
                    <h2 class="card-title h4">Посты</h2>
                </div>
            <ul class="list-group border-0 rounded-0">
                <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
                    <a href="${state.receivedData.post.link}" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${state.receivedData.post.name}</a>
                    <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
                </li>
            </ul>
        `;
        feeds.innerHTML = `
            <div class="card border-0">
                <div clas="card-body">
                    <h2 class="card-title h4">Фиды</h2>
                </div>
            </div>
            <ul class="list-group border-0 rounded-0">
                <li class="list-group-item border-0 border-end-0">
                    <h3 class="h6 m-0">${state.receivedData.title}</h3>
                    <p class="m-0 small text-black-50">${state.receivedData.description}</p>
                </li>
            </ul>
        `;
        urls.push(state.urlForm.url);
    } else if (state.urlForm.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = state.urlForm.translation;
    }
};

export default onChange(state, render);