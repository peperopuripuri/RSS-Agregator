import onChange from 'on-change';
import state from './model';

const dangerText = document.querySelector('.text-danger');
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
        urls.push(state.urlForm.url);
    } else if (state.urlForm.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = state.urlForm.translation;
    }
};

export default onChange(state, render);