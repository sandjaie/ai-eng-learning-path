function chooseDirection(name, button) {
  localStorage.setItem('learning-path-design-choice', name);
  document.querySelectorAll('.select-direction').forEach((item) => item.classList.remove('chosen'));
  if (button) button.classList.add('chosen');
  document.querySelectorAll('.selection').forEach((item) => {
    item.textContent = `Selected: ${name}`;
  });
}

function restoreSelection() {
  const selected = localStorage.getItem('learning-path-design-choice');
  if (!selected) return;
  document.querySelectorAll('.selection').forEach((item) => {
    item.textContent = `Selected: ${selected}`;
  });
  document.querySelectorAll(`[data-direction="${selected}"]`).forEach((item) => item.classList.add('chosen'));
}

function startSession(button) {
  const running = button.dataset.running === 'true';
  button.dataset.running = String(!running);
  button.textContent = running ? 'Start focus session' : 'Pause session';
  const timer = document.querySelector('.session-time');
  if (timer) timer.textContent = running ? '45:00' : '44:59';
}

function switchStudioTab(button, panelName) {
  document.querySelectorAll('.lesson-tab').forEach((tab) => tab.classList.remove('active'));
  button.classList.add('active');
  const title = document.querySelector('#studio-panel-title');
  const copy = document.querySelector('#studio-panel-copy');
  if (!title || !copy) return;
  const content = {
    learn: ['How to approach this topic', 'Use the short reading path below, then explain the difference between synchronous and asynchronous execution in your own words.'],
    practice: ['Practice task', 'Refactor a small blocking Python function into an async workflow and record what changed in behavior and error handling.'],
    reflect: ['Reflection prompt', 'Capture what felt confusing, the mental model that helped, and one example you can explain without looking at notes.']
  };
  title.textContent = content[panelName][0];
  copy.textContent = content[panelName][1];
}

document.addEventListener('DOMContentLoaded', restoreSelection);
