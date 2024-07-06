document.addEventListener('DOMContentLoaded', function(){
    let quizData=null;

    fetch('quiz-data.json').then((res)=>{
        return res.json();
    }).then((data)=>{
        // console.log(data);
        quizData=data;
        initSection();
    }).catch(error=>console.log('Error loading quiz data',error));

    function initSection(){
        let sections=document.querySelectorAll(".section");
        sections.forEach((section) => {
            section.addEventListener("click",()=>{
                let sectionNum=parseInt(section.getAttribute("data-section"));
                startQuiz(sectionNum);
            })
        });
    }
    function startQuiz(index){
      const currentQues=quizData.sections[index].questions;
      let quesIndex=0;
      let score=0;
      let answerSelected=false;
document.getElementById("quiz-container").style.display="none";
document.getElementById('question-container').style.display="block";
        
    showQuestions();

    function showQuestions(){
        const question = currentQues[quesIndex];
        const questionElement=document.getElementById('question');
        const optionsElement=document.getElementById('options');
        questionElement.textContent=question.question;
        optionsElement.innerHTML='';
        if(question.questionType==="mcq"){
            question.options.forEach((option,index)=>{
              const optionElement = document.createElement('div');
              optionElement.textContent=option;
                optionElement.addEventListener('click',function(){
                    if(!answerSelected){
                        answerSelected=true;
                        console.log(option);
                        optionElement.style.backgroundColor="green";
                        optionElement.style.color="white";
                        console.log(question.answer)
                        checkAnswer(option, question.answer);
                    }
                });
                optionsElement.appendChild(optionElement)
            })
        }
        else{
          const inputElement = document.createElement('input');
          inputElement.type=question.questionType ==='number' ? 'number':'text';
          const submitButton = document.createElement('button');
          submitButton.textContent= 'submit Answer';
          submitButton.className='submit-answer';
          submitButton.onclick=()=>{
            if(!answerSelected){
                answerSelected=true;
                checkAnswer(inputElement.value.toString(),question.answer.toString());
            }
          };

          optionsElement.appendChild(inputElement);
          optionsElement.appendChild(submitButton);
        }
    }

    function checkAnswer(givenAns,currectAns){
        const feedbackELement=document.createElement('div');
        feedbackELement.id='feedback';

        if(givenAns === currectAns){
             score++;
             feedbackELement.textContent='Correct!';
             feedbackELement.style.color="green";
        }
        else{
            feedbackELement.textContent = `Wrong. Correct answer: ${currectAns}`;
            feedbackELement.style.color="red";
        }
        const optionsElement=document.getElementById('options');
        optionsElement.appendChild(feedbackELement);
        updateScore();
    }
    
    function updateScore(){
        document.getElementById('score').textContent="Score: "+score;
    }
    
    document.getElementById("next-button").addEventListener("click", ()=>{
        if(quesIndex>= currentQues.length){
            console.log("quiz over");
            endQuiz();
        }else{
            answerSelected=false; // reset answerSelected to false
            quesIndex++;
            showQuestions();

        }
    })
    function endQuiz(){
        quesContainer=document.getElementById('question-container');
        quizContainer=document.getElementById('quiz-container');

        quesContainer.innerHTML=`
        <h1>Quiz Completed! </h1>
        <p>your final score: ${score}</p>
        <button id="home-button">Go to Home</button>`;
        document.getElementById('home-button').addEventListener('click',function (){
            quizContainer.style.display="grid";
            quesContainer.style.display="none";
        });
    }
    }

});