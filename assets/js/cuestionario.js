let questions = [];
let texto = "";
let currentQuestionIndex = 0;
let questionNumber = 0;
let value = "false";
let edad_years = 21;

let questionElement = document.getElementById("question");
let answerButtons = document.getElementById("answer-buttons");
let nextButton = document.getElementById("next-btn");

function startQuiz(texto){
    currentQuestionIndex = 0;
    nextButton.innerHTML = "Siguiente";
    fetchQuestions(texto);
}


function fetchQuestions(tema) {
    fetch('./assets/data/questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data[tema];
        showQuestion();
    })
    .catch(error => {
        console.error('Error al cargar las preguntas:', error);
        showResult(false);
    });
}


function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionNumber++;
    questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;

    if (currentQuestion.input === "button") {
        // Crear botones como opciones de respuesta
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);
            button.dataset.answerValue = answer.value;
            button.addEventListener("click", selectAnswer)
        });
    } else if (currentQuestion.input === "date") {
        // Crear campo de entrada de fecha
        const dateInput = document.createElement("input");
        dateInput.setAttribute("type", "date");
        dateInput.classList.add("date-input");
        dateInput.addEventListener("change", () => {
            const fechaNacimiento = new Date(dateInput.value);
            const hoy = new Date();
            const diffTime = Math.abs(hoy - fechaNacimiento);
            const edad = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365)); // Calcular la edad en años
    
            value = edad;
            edad_years = edad;
            console.log(value);
            nextButton.style.display = "block";
        });
        answerButtons.appendChild(dateInput);

    } else if (currentQuestion.input === "number") {
        // Crear campo de entrada de número
        const numberInput = document.createElement("input");
        numberInput.setAttribute("type", "number");
        numberInput.classList.add("number-input");
        numberInput.setAttribute("min", "0");
        numberInput.addEventListener("input", () => {
            value = numberInput.value; // Asignar el valor del número como la respuesta seleccionada
            nextButton.style.display = "block";
        });
        answerButtons.appendChild(numberInput);
    }
}


function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild)
    }
}


function selectAnswer(event){
    const selectedBtn = event.target;
    value = selectedBtn.dataset.answerValue;
    answerButtons.childNodes.forEach(button => {
        button.classList.remove("selected");

    });

    if(value){
        selectedBtn.classList.add("selected");
        nextButton.style.display = "block";
    }
}


function handleNextButton() {
    const currentQuestion = questions[currentQuestionIndex];
    const condition = currentQuestion.condition; // Obtener la condición de la pregunta actual

    if (condition === null || (condition !== null && value !== null && eval(condition))) {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            var currentRange = parseInt(currentQuestion.range);

            //LOgica....
            //....
            //....
            
            showQuestion();
        } else {
            showResult(true);
        }
    } else {
        showResult(false);
    }
}


function showResult(valid){
    var result = 100;
    resetState();

    if (valid == true){
        questionElement.innerHTML = `Según nuestros cálculos, puedes ser beneficiario de ${result}€`;
    }
    else{
        currentQuestionIndex = questions.length+1;
        questionElement.innerHTML = `No Apto para la subvención`;
    }
    
    nextButton.innerHTML = "Volver a responder";
    nextButton.style.display = "block";
}

function mostrarCuestionario(){
    var linkElement = event.target;
    texto = linkElement.innerText;
    startQuiz(texto);
}

document.addEventListener("DOMContentLoaded", function() {
    const appContainer = document.querySelector('.app');
    appContainer.classList.add('show');

    questionElement = document.getElementById("question");
    answerButtons = document.getElementById("answer-buttons");
    nextButton = document.getElementById("next-btn");

    nextButton.addEventListener("click", ()=> {
        if(currentQuestionIndex < questions.length){
            handleNextButton();
        }else{
            questionNumber = 0;
            startQuiz(texto);
        }
    });
});