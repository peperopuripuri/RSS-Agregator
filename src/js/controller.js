import { input, urls } from './view';
import * as yup from "yup";
import watch from "./view";

const form = document.querySelector('.rss-form');

const validate = (url, urls = new Array()) => {
    const watchedState = watch;
    watchedState.urlForm.url = url;
    yup
        .object({
            url: yup.string().url().notOneOf(urls),
        })
        .validate(watchedState.urlForm)
        .then(value => {
            watchedState.status = 'correct';
            console.log(value);
        })
        .catch(error => {
            if (error.message === 'url must be a valid URL') watchedState.status = 'error';
            else if (error.inner.length === 0) watchedState.status = 'here';
        });
};

export default () => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        validate(input.value, urls);
    });
};