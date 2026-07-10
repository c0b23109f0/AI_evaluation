const GAS_URL = "https://script.google.com/macros/s/AKfycbzNXMk5kQMij4V9Vzm7Kf8G8obaY8iPENOVCVpNFEavfEIIgyocCw-MHq0-MXoRsAc/exec";
let startTime;
let results = [];
let questions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let selectedAnswer = "";
let selectedReason = "";
let patternId = 0;

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

    const patterns = await response.json();

    // パターンをランダムに1つ選ぶ
    const randomIndex = Math.floor(Math.random() * patterns.length);

    patternId = randomIndex + 1;

    selectedQuestions = patterns[randomIndex];

    showQuestion();

}

function showQuestion(){

    const q = selectedQuestions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `問題 ${currentQuestion+1} / 3`;

    document.getElementById("textA").textContent = q.textA;
    document.getElementById("textB").textContent = q.textB;

    startTime = Date.now();

<<<<<<< HEAD
    // A/Bボタンを再表示
    document.getElementById("buttonA").style.display = "inline-block";
    document.getElementById("buttonB").style.display = "inline-block";

    // 理由選択画面を隠す
    document.getElementById("reasonArea").style.display = "none";

    // 理由の選択を解除
    document
    .querySelectorAll('input[name="reason"]')
    .forEach(r => r.checked = false);

    selectedAnswer = "";
    selectedReason = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const buttonA = document.getElementById("buttonA");

if(buttonA){

    buttonA.addEventListener("click",()=>{

        selectedAnswer="A";

        showReason();

    });

}

const buttonB = document.getElementById("buttonB");

if(buttonB){

    buttonB.addEventListener("click",()=>{

        selectedAnswer="B";

        showReason();

    });

}
=======
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
>>>>>>> 7503d75c53c1971f9dc39f7157dbb8003a0a7b4a

function answerQuestion(answer, reason){

    const q = selectedQuestions[currentQuestion];

    const responseTime =
        (Date.now() - startTime) / 1000;

    const reasonText = Array.isArray(reason)
        ? reason.join('; ')
        : reason;

    results.push({

        subject:
            localStorage.getItem("subject"),

        pattern:
            patternId,
        
        question:
            q.id,

        answer:
            answer,

        correct:
            q.answer,

        reason:
<<<<<<< HEAD
            reasonText,
=======
            reason,
>>>>>>> 7503d75c53c1971f9dc39f7157dbb8003a0a7b4a

        response_time:
            responseTime

    });

    currentQuestion++;

    if(currentQuestion < 3){

        showQuestion();

    }else{

        console.log(results);
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

<<<<<<< HEAD
    document.getElementById("reasonArea").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}

const nextButton = document.getElementById("nextButton");

if(nextButton){

    nextButton.addEventListener("click",()=>{

        const checkedNodes = Array.from(
            document.querySelectorAll('input[name="reason"]:checked')
        );

        if(checkedNodes.length === 0){

            alert("理由を少なくとも1つ選択してください");

            return;

        }

        const reasons = checkedNodes.map(n => n.value);
        const reasonStr = reasons.join('; ');
        selectedReason = reasonStr;
        console.log("selectedReason:", reasonStr);
        answerQuestion(
            selectedAnswer,
            reasons
        );

    });

}
=======
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
>>>>>>> 7503d75c53c1971f9dc39f7157dbb8003a0a7b4a
