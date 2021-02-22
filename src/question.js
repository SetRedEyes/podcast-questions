//нужно возвращать promise что бы "зачейнить"
export class Question{
  static create(question) {  //контекст не нужен, static что бы использовать статистические методы, что бы использовать в других файлах
   return  fetch('https://podcast-setredeyes-app.firebaseio.com/question.json', { //второй параметр - объект
      // questions - коллекция(ключ в объекте); .json -правило в firebase
     // return fetch возвращаем что бы использовать\импортировать в другой файл
      method: 'POST',
        //POST - создание нового обЪекта, GET - получени объекта
        //PUT -  изменения полностью, PATCH -частичные изменения, DELETE
      body: JSON.stringify(question),// контент
        //что бы firebase понимал что это за данныеб нучжно "застрингифаить" объект
       header : {
        'Content-Type': 'application/json' //ковычки, потому что в названии дефис(не валидный символ для ключа в объекте
       }
        })
        .then(response => response.json())
        .then(response => { //network -> XHR -> у response есть поле name и в нем храниться id
          question.id = response.name
          return question
        })
        .then(addToLocalStorage)
        .then(Question.renderList)//this.renderList не будет работать, стат. методы работаеют с классами, а не с объектами
  }

    static fetch(token){
      if(!token){
        return Promise.resolve('<p class="error">You shall not pass!</p>')
      }
     return fetch(`https://podcast-setredeyes-app.firebaseio.com/question.json?auth=${token}`)// GET по умолчанию в методе fetch; ?auth=${token}
        .then(response =>response.json())
        .then(response => {
          if(response && response.error){//если в question есть ключ error, то вернуть строку
            return `<p class="error>${response.error}</p>`
          }

          return response ? Object.keys(response).map(key=>({//если нет данных возвращается null. если что то здесь есть. пробегаюсь по response. данная конструкция возвращает массив из ключей
            ...response[key],//возвращаю объект. у которого будут все те поля которые находятся в response - объект. которой пришел с сервера и тут получаем его id(text и date)
            id: key
          })) : []//если в response null возвращаем пустой массив
        })
    }

    static renderList(){
      const questions = getQuestionsFromLocalStorage()

      const html = questions.length //если 0, то ваопросов нет
        ? questions.map(toCard).join('')//обращаемся к массиву questions и с помощью оператора map,  трансформируем каждый объект этого массива с помощью f toCard() и на выходи должна быть строка
        : '<div class="mui--text-headline">Say your PRAY, mortal!</div>'
      //кладем html в то место, где нужно вывести список
      const list = document.getElementById('list')
      list.innerHTML = html//замещаем на нужный HTML
  }
    static listToHTML(questions){
    return questions.length
      ? `<ol>${questions.map(q=> `<li>${q.text}</li>`).join('')}</ol>`
      : `<p>No questions yet</p>`
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage()// all - JS массив
  all.push(question)
//необходимо получить список всех вопросов, которые есть в localStorage и уже к ним добавить новый вопрос и потом записать обратно этот массив
  localStorage.setItem('questions', JSON.stringify(all))// перезапись одного и того же вопроса если аргумен question
}

function getQuestionsFromLocalStorage() {
  // получаем строку, ее нужно "распарсить"
  return JSON.parse(localStorage.getItem('questions') || '[]')// если нет вопросов в localStorage.questions - парсим пустой массив
}

function toCard(question) { //принимает в себя один вопрос
return `
 <div class="mui--text-black-54">
 ${new Date(question.date).toLocaleDateString()}
 ${new Date(question.date).toLocaleTimeString()}
</div>
 <div>${question.text}</div>
 <br>
`
}