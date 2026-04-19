let steps = [];
let stepEls = [];
let currentIndex = 0;

let synth = window.speechSynthesis;
let recognition = null;
let isListening = false;

let timerInterval = null;
let remainingSeconds = 0;
let timerPaused = false;
let timerActive = false;

const langMap = {
  en: "en-US",
  hi: "hi-IN",
};

function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi
  return "en";
}

function getTimerSeconds(text) {
  const match = text.match(
    /(\d+)\s*(hour|hr|hours|minute|min|minutes|second|sec|seconds|घंटा|मिनट|सेकंड)/i,
  );

  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.includes("hour") || unit.includes("hr") || unit === "घंटा")
    return value * 3600;
  if (unit.includes("min") || unit === "मिनट") return value * 60;
  if (unit.includes("sec") || unit === "सेकंड") return value;

  return 0;
}

function highlightStep(index) {
  stepEls.forEach((el, i) => {
    el.classList.toggle("highlight", i === index);
    if (i === index) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

function speakStep(index) {
  if (index < 0 || index >= steps.length) return;

  const text = steps[index];
  const lang = detectLanguage(text);

  document.getElementById("current-step").innerText = "👉 " + text;
  highlightStep(index);

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langMap[lang] || "en-US";

  synth.speak(utterance);

  startTimerIfNeeded(text);
}

function startTimerIfNeeded(text) {
  clearInterval(timerInterval);
  timerActive = false;
  timerPaused = false;

  document.getElementById("timer").innerText = "";
  document.getElementById("timer-controls").style.display = "none";

  const seconds = getTimerSeconds(text);
  if (!seconds) return;

  remainingSeconds = seconds;
  timerActive = true;

  document.getElementById("timer-controls").style.display = "flex";

  timerInterval = setInterval(() => {
    if (timerPaused) return;

    remainingSeconds--;
    document.getElementById("timer").innerText = `⏱ ${remainingSeconds}s`;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerActive = false;

      document.getElementById("timer").innerText = "Time's up! Say 'Next'";

      synth.speak(
        new SpeechSynthesisUtterance("Time is up. Say next to continue."),
      );
    }
  }, 1000);
}

function startListening() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  isListening = true;

  recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript
      .trim()
      .toLowerCase();

    console.log("Voice:", command);

    if (/next/.test(command)) nextStep();
    else if (/repeat|again/.test(command)) repeatStep();
    else if (/stop|end/.test(command)) stopCooking();
    else if (/pause/.test(command) && timerActive && !timerPaused) pauseTimer();
    else if (/resume|continue/.test(command) && timerActive && timerPaused)
      resumeTimer();
  };

  recognition.onend = () => {
    if (isListening) recognition.start();
  };

  recognition.start();
}

function stopListening() {
  if (!recognition) return;
  isListening = false;
  recognition.stop();
}

function startCooking() {
  steps = Array.from(document.querySelectorAll("#stepsList li")).map(
    (li) => li.innerText,
  );

  stepEls = document.querySelectorAll("#stepsList li");

  currentIndex = 0;

  speakStep(currentIndex);
  startListening();
}

function nextStep() {
  synth.cancel();
  clearInterval(timerInterval);

  timerActive = false;

  document.getElementById("timer-controls").style.display = "none";

  currentIndex++;

  if (currentIndex < steps.length) {
    speakStep(currentIndex);
  } else {
    document.getElementById("current-step").innerText = "🎉 Recipe completed!";
    highlightStep(-1);
  }
}

function repeatStep() {
  speakStep(currentIndex);
}

function stopCooking() {
  synth.cancel();
  stopListening();

  clearInterval(timerInterval);
  timerActive = false;

  document.getElementById("current-step").innerText = "Stopped.";
  document.getElementById("timer").innerText = "";

  highlightStep(-1);
}

function pauseTimer() {
  timerPaused = true;
  synth.speak(new SpeechSynthesisUtterance("Timer paused"));
}

function resumeTimer() {
  timerPaused = false;
  synth.speak(new SpeechSynthesisUtterance("Timer resumed"));
}

window.startCooking = startCooking;
window.nextStep = nextStep;
window.repeatStep = repeatStep;
window.stopCooking = stopCooking;
window.pauseTimer = pauseTimer;
window.resumeTimer = resumeTimer;
