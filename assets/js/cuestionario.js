let questions = [];
let texto = "";
let currentQuestionIndex = 0;
let questionNumber = 0;
let value = "false";
let edad_years = 21;
let result = 100;

let questionElement = document.getElementById("question");
let answerButtons = document.getElementById("answer-buttons");
let nextButton = document.getElementById("next-btn");

function startQuiz(texto){
    currentQuestionIndex = 0;
    questionNumber = 0;
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

            if(currentQuestion.question =="Salario bruto (EUR por mes)"){
                result = value * 2.5;
            }
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
    var v = selectedBtn.dataset.answerValue;
    if(v == "true"){
        value = true;
    }
    else if(v == "false"){
        value = false;
    }
    else{
        value = v;
    }

    answerButtons.childNodes.forEach(button => {
        button.classList.remove("selected");

    });

    if(v){
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
            
            // Lógica para determinar la siguiente pregunta
            let nextQuestionIndex = currentQuestionIndex;
            while (nextQuestionIndex < questions.length) {
                const nextQuestion = questions[nextQuestionIndex];
                const nextRange = parseInt(nextQuestion.range);

                // Verificar si la pregunta actual y la siguiente tienen el mismo rango
                if (nextRange === currentRange) {
                    // Si la pregunta actual es de tipo button, mostrar la siguiente pregunta de inmediato
                    if (currentQuestion.input === "button") {
                        currentQuestionIndex = nextQuestionIndex;
                        break;
                    } else if (currentQuestion.input === "number" || currentQuestion.input === "date") {
                        // Si la pregunta actual es de tipo number o date, verificar si el valor es válido
                        if (value !== null && value !== "") {
                            currentQuestionIndex = nextQuestionIndex;
                            break;
                        }
                    }
                } else if (nextRange === currentRange + 1) {
                    // Si la siguiente pregunta tiene el rango siguiente, mostrarla solo si el valor es true
                    if (value == true) {
                        currentQuestionIndex = nextQuestionIndex;
                        break;

                    } else if (currentQuestion.input === "number" || currentQuestion.input === "date") {
                        // Si la pregunta actual es de tipo number o date, verificar si el valor es válido
                        if (value !== null && value !== "") {
                            currentQuestionIndex = nextQuestionIndex;
                            break;
                        }
                    }
                } else if(nextRange < currentRange){
                    currentQuestionIndex = nextQuestionIndex;
                    break;
                }
                nextQuestionIndex++;
            }

            showQuestion();
        } else {
            showResult(true);
        }
    } else {
        showResult(false);
    }
}


function showResult(valid){
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
            startQuiz(texto);
        }
    });
});