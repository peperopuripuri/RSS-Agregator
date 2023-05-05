import '../scss/styles.scss'
import * as yup from "yup";
import { watchedObj } from "./view";

const input = document.querySelector('#url-input');
const button = document.querySelector('.px-sm-5');
const dangerText = document.querySelector('.text-danger');

const alreadyHere = [];
const urlSchema = yup.object({
    rss: yup.string().url().nullable(),
});
button.addEventListener('click', e => {
    e.preventDefault();
    watchedObj.rss = input.value;
    urlSchema
        .validate(watchedObj)
        .then(value => {
            alreadyHere.push(watchedObj.rss);
            alreadyHere.map((el, index) =>{
                if (index !== alreadyHere.indexOf(el)) {
                    dangerText.innerHTML = `RSS уже существует`;
                    dangerText.removeAttribute('style');
                    input.classList.add('is-invalid');
                    alreadyHere.pop(el);
                } else {
                    if (alreadyHere.length > 2) alreadyHere.splice(0, 1)
                    // input.value = null;
                    input.classList.remove('is-invalid');
                    dangerText.setAttribute('style', 'color: green !important');
                    dangerText.innerHTML = `RSS успешно загружен`;
                    console.log(alreadyHere);
                    console.log('YEESSSSS THAT IS NICE:', value);
                }
            });
        })
        .catch(err => {
            dangerText.removeAttribute('style');
            input.classList.add('is-invalid');
            dangerText.innerHTML = `Ссылка должна быть валидным URL`;
            console.log(err);
        })
});
