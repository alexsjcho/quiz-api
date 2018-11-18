let correctAnswer,
    correctNumber = (localStorage.getItem('guiz_game_correct')?localStorage.getItem('guiz_game_correct') :0),
    incorrectNumber = (localStorage.getItem('guiz_game_incorrect')?localStorage.getItem('guiz_game_incorrect') :0);

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();

    eventListeners();
});

eventlistners = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer);
    document.querySelector('#clear-storage').addEventListener('click', clearResults);
}

//Loads a new question from an API
loadQuestion = () => {
    const url = 'https://opentdb.com/api.php?amount=1';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results));
}

//Display the question HTML from API
displayQuestion = question => {
    
    //Create the HTML Question
    const questionHTML = document.createElement('div');
    questionHTML.classList.add('col-12');

    questions.forEach(question => {
        //read the correct answer
        correctAnswer = question.correct_answer;

        //Inject the correct answer in the possible answer
        let possibleAnswers =question.incorrect_answers;
        possibleAnswers.splice(Math.floor(Math.random()*3),0,correctAnswer);

        //Add the HTML for the current question
        questionHTML.innerHTML = `
            <div class="row justify-content-between heading">
                <p class"category"> Category: ${question.category}</p>
                <div class="totals">
                    <span class="badge badge-success">${correctNumber}</span>
                    <span class="badge badge-danger">${incorrectNumber}</span>
                </div>
            </div>
            <h2 class="text-center"> ${question.question}</h2>
        
         `;

        //Generate the HTML for possible answers
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('questions', 'row', 'justify-content-round', 'mt-4');
        possibleAnswers.forEach(answer => {
            const answerHTML = document.createElement('li');
            answerHTML.classList.add('col-12', 'col-md-5');
            answerHTML.textContent = answer;

            //Attach an event when the answer is clicked
            answerHTML.onclick = selectAnswer;
            answerDiv.appendChild(answerHTML);


            answersDiv.appendChild(answerHTML);
        });
        questionHTML.appendChild(answerDiv);

        //render code in HTML
        document.querySelector('#app').appendChild(questionHTML);

    })
}

//When the answer is selected
selectAnswer = (e) => {

//removes the previous active class for the answer
if(document.querySelector('.active')){
    const activeAnswer = document.querySelector('.active');
    activeAnswer.classList.remove('active');
}
    //adds the correct answer
    e.target.classList.add('actives');
}

//Checks if the answer is correct and 1 answer is selected
validateAnswer = () => {
    if(document.querySelector('.questions .active')) {
        //everything is fine, check if answer is correct, or not
        checkAnswer();
    } else {
        //error, user didn't select anything
        const errorDiv =document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
        errorDiv.textContent = 'Please select 1 answer';
        //select the questions div to insert the alert
        const questionsDiv = document.querySelector('.questions');
        questionsDiv.appendChild(errorDiv);

        //remove the error
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);
    }
}

//check if the answer is correct or not
checkAnswer = () => {
    const userAnswer = document.querySelector('.questions .active');

    if(userAnswer.textContent === correctAnswer) {
        correctNumber++;
    } else {
        incorrectNumber++;
    }

    //Save into localstorage
    saveIntoStorage();

    //Clear previous HTML
    const app = document.querySelector('#app');
    while(app.firstChild){
        app.removeChild(app.firstChild);
    }
    //Load a new question
    loadQuestion();
}

//Saves coorect or incorrect totals in storage
saveIntoStorage = () => {
    localStorage.setItem('quiz_game_correct', correctNumber);
    localStorage.setItem('quiz_game_incorrect', incorrectNumber);
}

//Clears the result from storage
clearResults = () => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload()；
    }, 500);
}
    