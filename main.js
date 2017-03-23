let questions;
let score = {
    correct: 0,
    incorrect: 0,
    answered: 0
};
const startBtn = document.querySelector('.start-game');
const newGame = document.querySelector('.in-game-new button');
const questionsWrap = document.querySelector('.question-wrapper');
const questionP = document.querySelector('.question');
const answerList = document.querySelector('.answer-list');

$(document).ready(() => {
    $(newGame).hide();
    let theater = theaterJS({
      "minSpeed": 100,
      "maxSpeed": 350
    });
    theater.addActor('game');
    theater
        .addScene('game:Let\'s play', 200, '.', 200, '.', 200, '. ', 'TRIVIA!!!')
    });

function checkAnswer(q,a) {
    let answer;
    const nextBtn = ('<button type="submit" class="next-question">continue</button>');
    if (q.correct_answer === a) {
        score.correct++;
        answer = 'Yes!';
        questionP.innerHTML = answer;
        answerList.innerHTML = nextBtn;
    }
    else {
        score.incorrect++;
        answer = 'Nope!';
        questionP.innerHTML = `${answer} the correct answer was "${q.correct_answer}"`;
        answerList.innerHTML = nextBtn;
    }
    score.answered++;
    document.querySelector('.next-question').addEventListener('click', (e) => {
        if (score.answered === 10) {
            endGame();
        }
        else{
            buildQuestion(questions,score.answered);
        }
    });
}

function endGame() {
    $(answerList).empty();
    if (score.correct < 5) {
        questionP.innerHTML = `Your score: ${(score.correct/score.answered) * 100}% <span>That's ok, keep trying!</span>`;
    }
    else if (score.correct < 9 && score.correct > 4) {
        questionP.innerHTML = `Your score: ${score.correct/score.answered}% <span>Not too bad!</span>`;
    }
    else {
        questionP.innerHTML = `Your score: ${score.correct/score.answered}% <span>Wow, great job!</span>`;
    }
}

function buildQuestion(questionObj,i) {
    const answers = questionObj[i].incorrect_answers;
    let question = questionObj[i].question;
    if (question.indexOf('&#039;') !== -1) {
        const removeChars = question.split('&#039;');
        question = removeChars.join('');
    }
    if (question.indexOf('&quot;') !== -1) {
        const removeChars = question.split('&quot;');
        question = removeChars.join('');
    }
    answers.push(questionObj[i].correct_answer);
    $('.counter').text(`${score.answered + 1} / 10`);
    $(questionP).empty();
    $(questionP).text(question);
    $(answerList).empty();
    let index = 0;
    while (index < answers.length) {
        $(answerList).append(`
            <fieldset>
                <input type="radio" id="answer-${index}" value="${answers[index]}" name="answer" />
                <label for="answer-${index}">${answers[index]}</label>
            </fieldset>
            `)
        index++;
    }
    $('.answer-list input').change((e) => {
        $('.answer-list input').parent().removeClass('selected');
        if (e.target.checked) {
            $(e.target).parent().addClass('selected');
        }
    })
    $(answerList).append('<div class="submit-wrapper"><button type="submit">Submit</button></div>')
}

function getQuestions() {
    $.ajax({
        type: 'GET',
        url: 'https://opentdb.com/api.php?amount=10&type=multiple',
        contentType: 'text/plain',
        xhrFields: {
            withCredentials: false
          },
        success: (d) => {
            sessionStorage.setItem('questions', JSON.stringify(d));
            questions = $.parseJSON(sessionStorage.getItem('questions')).results;
            buildQuestion(questions,0);
        }
    });
}

function startGame() {
    score = {
        correct: 0,
        incorrect: 0,
        answered: 0
    };
    $('.scene').removeClass('in');
    $(questionsWrap).addClass('in');
    $('nav').hide();
    $(newGame).show();
    $('.counter').text('');
    getQuestions();
}

newGame.addEventListener('click', () => {
        startGame();
    });

startBtn.addEventListener('click', () => {
    startGame();
});

answerList.addEventListener('submit', (e) => {
    e.preventDefault();
    let guess = null;
    const answers = document.querySelectorAll('input[type="radio"]');
    let index = 0;
    while (index < answers.length) {
        if (answers[index].checked) {
            guess = answers[index].value;
        }
        index++;
    }
    checkAnswer(questions[score.answered],guess);
});