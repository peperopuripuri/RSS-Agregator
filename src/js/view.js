import onChange from 'on-change';
import state from './model';

export const input = document.querySelector('#url-input');
const dangerText = document.querySelector('.text-danger');
export const urls = new Array();

const render = () => {
    if (state.status === 'here') {
        if (urls.length > 1) urls.splice(0, 1);
        dangerText.innerHTML = `RSS уже существует`;
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
    } else if (state.status === 'correct') {
        input.value = '';
        input.classList.remove('is-invalid');
        dangerText.setAttribute('style', 'color: green !important');
        dangerText.innerHTML = `RSS успешно загружен`;
        urls.push(state.urlForm.url);
    } else if (state.status === 'error') {
        dangerText.removeAttribute('style');
        input.classList.add('is-invalid');
        dangerText.innerHTML = `Ссылка должна быть валидным URL`;
    }
};

export default onChange(state, render);