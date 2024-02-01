document.addEventListener("DOMContentLoaded", function() {
    const appContainer = document.querySelector('.app');
    appContainer.classList.add('show');

    const questions = [
        {
            id: "1",
            question: "¿Cobra alguna ayuda de manera habitual?",
            answers: [
                { text: "Si", value: "true"},
                { text: "No", value: "false"},
            ],
            range: "1",
            parentQuestion: null,
        },
        {
            id: "2",
            question: "Indique si recibe alguna de las ayudas siguiente:",
            answers: [
                { text: "Prestación por desempleo", value: "true"},
                { text: "ERTE", value: "true"},
                { text: "Ninguna de las anteriores", value: "false"},
            ],
            range: "2",
            parentQuestion: "1",
        },
        {
            id: "3",
            question: "Indique su fecha de nacimiento:",
            answers: [
                { text: "Fecha", value: "true"},
            ],
            range: "1",
            parentQuestion: null,
        },
        {
            id: "4",
            question: "¿Tiene usted hij@(s)?",
            answers: [
                { text: "Si", value: "true"},
                { text: "No", value: "false"},
            ],
            range: "1",
            parentQuestion: null,
        },

        {
            id: "5",
            question: "Número de hij@(s)",
            answers: [
                { text: "Numero", value: "true"},
            ],
            range: "2",
            parentQuestion: "4",
        },
    ];

    let currentQuestionIndex = 0;
    let questionNumber = 0;
    let value = "false";

    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    function startQuiz(){
        currentQuestionIndex = 0;
        nextButton.innerHTML = "Siguiente";
        showQuestion();
    }

    function showQuestion(){
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        questionNumber++;
        questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);
            button.dataset.answerValue = answer.value;
            button.addEventListener("click", selectAnswer)
        });
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

    function handleNextButton(){
        const currentQuestion = questions[currentQuestionIndex];

        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            var currentRange = parseInt(currentQuestion.range);

            if (value === "true") {
                const nextQuestionWithParent = questions.find(question =>
                    question.parentQuestion === currentQuestion.id
                );

                if (nextQuestionWithParent && nextQuestionWithParent.range == (currentRange+1).toString()) {
                    currentQuestionIndex = questions.indexOf(nextQuestionWithParent);
                }
            }else {
                currentRange = 1;
                let nextQuestionIndex = currentQuestionIndex;
                while (nextQuestionIndex < questions.length) {
                    const nextQuestion = questions[nextQuestionIndex];
                    const nextRange = parseInt(nextQuestion.range);

                    if (nextRange === currentRange) {
                        currentQuestionIndex = nextQuestionIndex;
                        break;
                    }
                    nextQuestionIndex++;
                }
            }
            showQuestion();
        }
        else{
            showResult();
        }
    }

    function showResult(){
        var result = 100;
        resetState();
        questionElement.innerHTML = `Según nuestros cálculos, puedes ser beneficiario de ${result}€`;
        nextButton.innerHTML = "Volver a responder";
        nextButton.style.display = "block";
    }

    nextButton.addEventListener("click", ()=> {
        if(currentQuestionIndex < questions.length){
            handleNextButton();
        }else{
            questionNumber = 0;
            startQuiz();
        }
    });

    startQuiz();
});