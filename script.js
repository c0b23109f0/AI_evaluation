const GAS_URL = "https://script.google.com/macros/s/AKfycbxqDtK4c7RhHRfQMXqvkVx1vt1afsUZq-YHD51uJir2Wc2JzXAMDljCSmZYgMHlg4WZ/exec";
let startTime;
let results = [];
let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;

// index.html
const startButton = document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", () => {

        // ランダムな8文字のIDを生成
        const subject = crypto.randomUUID().slice(0, 8);

        localStorage.clear();

        localStorage.setItem("subject", subject);

        location.href = "experiment.html";

    });

}

if (window.location.pathname.includes("experiment.html")) {

    initializeExperiment();

}

async function initializeExperiment() {

    const response = await fetch("questions.json");

    questions = await response.json();

    questions.sort(() => Math.random() - 0.5);

    selectedQuestions = questions.slice(0, 3);

    showQuestion();

}

function showQuestion(){

    const q = selectedQuestions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `問題 ${currentQuestion+1} / 3`;

    document.getElementById("textA").textContent = q.textA;
    document.getElementById("textB").textContent = q.textB;

    startTime = Date.now();

    // ===== 追加 =====

    // A/Bを表示
    document.getElementById("buttonA").style.display = "inline-block";
    document.getElementById("buttonB").style.display = "inline-block";

    // 理由を隠す
    document.getElementById("reasonArea").style.display = "none";

    // 理由の選択解除
    document.querySelectorAll('input[name="reason"]').forEach(r=>{
        r.checked = false;
    });

    selectedAnswer = "";
}

document.getElementById("buttonA")
.addEventListener("click",()=>{

    selectedAnswer="A";

    showReason();

});

document.getElementById("buttonB")
.addEventListener("click",()=>{

    selectedAnswer="B";

    showReason();

});

function answerQuestion(answer, reason){

    const q = selectedQuestions[currentQuestion];

    const responseTime =
        (Date.now() - startTime) / 1000;

    results.push({

        subject:
            localStorage.getItem("subject"),

        question:
            q.id,

        answer:
            answer,

        correct:
            q.answer,

        reason:
            reason,

        response_time:
            responseTime

    });

    currentQuestion++;

    if(currentQuestion < 3){

        showQuestion();

    }else{

        localStorage.setItem(
            "results",
            JSON.stringify(results)
        );

        location.href = "finish.html";

    }

}

if(window.location.pathname.includes("finish.html")){

    sendResults();

}

async function sendResults(){

    const data =
        JSON.parse(
            localStorage.getItem("results")
        );

    const returnButton = document.getElementById("returnButton");

    if (returnButton) {
        returnButton.disabled = true;
        returnButton.textContent = "送信中...";
    }

    if(!data) {
        if (returnButton) {
            returnButton.disabled = false;
            returnButton.textContent = "スタート画面へ戻る";
            returnButton.addEventListener("click", () => {
                location.href = "index.html";
            });
        }
        return;
    }

    try{

        for(const row of data){

            await fetch(GAS_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(row)
            });

        }

        localStorage.removeItem("results");

        document.getElementById("status").textContent =
            "送信が完了しました。";

    }

    catch(e){

        document.getElementById("status").textContent =
            "送信に失敗しました。";

        console.error(e);

    }

    if (returnButton) {
        returnButton.disabled = false;
        returnButton.textContent = "スタート画面へ戻る";
        returnButton.addEventListener("click", () => {
            location.href = "index.html";
        });
    }

}

const stopButton = document.getElementById("stopButton");

if (stopButton) {

    stopButton.addEventListener("click", () => {

        const result = confirm(
            "実験を中断しますか？\n途中までの回答は保存されません。"
        );

        if (result) {

            localStorage.clear();

            location.href = "index.html";

        }

    });

}

function showReason(){

    document.getElementById("buttonA").style.display="none";
    document.getElementById("buttonB").style.display="none";

    document.getElementById("reasonArea").style.display="block";

}

document
.getElementById("nextButton")
.addEventListener("click",()=>{

    const checked =
    document.querySelector(
        'input[name="reason"]:checked'
    );

    if(!checked){

        alert("理由を選択してください");

        return;

    }

    answerQuestion(
        selectedAnswer,
        checked.value
    );

});