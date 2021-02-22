import {Question} from "./question";
import {createModal, isValid} from "./utils";
import {authWithEmailAndPassword, getAuthForm} from "./auth";
import './styles.css'


const form = document.getElementById('form')
const modalBtn =document.getElementById('modal-btn')
const input = form.querySelector('#question-input')//когда получаем элемент через getElementById, у него нет этой f, поэтому используем querySelector('#...)
const submitBtn = form.querySelector('#submit')

window.addEventListener('load', Question.renderList)//сохранить вопросы после перезагрузки страницы
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', ()=>{
  submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
  event.preventDefault()// отменяем поведение по умолчанию, что бы форма не перезагружалась console.log()

  if(isValid(input.value)){
    const question = {
      text: input.value.trim(), //trim удаляет лишние пробелы
      date: new Date().toJSON()
    }

    submitBtn.disabled=true

    //Async request to server to save question (нужно отправить аснх запрос на сервер, что бы сохранить созданный вопрос
    Question.create(question).then(()=>{ //метод create ждет объект question 18 строчка и возвращает promise
      input.value=''
      input.className=''
      submitBtn.disabled=false
    })
  }
}

function openModal() {
createModal('Authorization',getAuthForm())
  document.getElementById('auth-form')
  .addEventListener('submit', authFormHandler, {once:true})//once - что бы событие было добавлено 1 раз
}

function authFormHandler(event) {
  event.preventDefault()

  const btn = event.target.querySelector('button')// в форме одна кнопка
  const email = event.target.querySelector('#email').value
  const password = event.target.querySelector('#password').value
  //event.target - сама форма, забираем value инпутов в отдельные переменные

  btn.disabled=true
  authWithEmailAndPassword(email,password)
      .then(Question.fetch)//.then(token => {return Question.fetch(token) })
      .then(renderModalAfterAuth)
      .then(()=>btn.disabled=false)
}

function renderModalAfterAuth (content) {
 if(typeof content === 'string'){
   createModal('Error', content)
 }else{
   createModal('List of questions', Question.listToHTML(content))//content нужно привести к списку. createModaд() принимает html
 }
}
