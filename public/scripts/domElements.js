// public/scripts/domElements.js

// 画面要素
export const modeSelectionScreen = document.getElementById('mode-selection-screen');
export const gameScreen = document.getElementById('game-screen');

// モード選択画面の要素
export const playerCountSelectMode = document.getElementById('player-count-select-mode');
export const timeLimitSelectMode = document.getElementById('time-limit-select-mode');
export const charLimitSelectMode = document.getElementById('char-limit-select-mode');
export const consonantMatchModeCheckbox = document.getElementById('consonant-match-mode-checkbox');
export const startGameButton = document.getElementById('start-game-button');

// 遊ぶ画面の要素 (既存のもの)
export const previousWordDisplay = document.getElementById('previous-word-display');
export const wordInput = document.getElementById('word-input');
export const submitButton = document.getElementById('submit-button');
export const resetButton = document.getElementById('reset-button'); // このボタンは「モード選択に戻る」に再利用
export const passButton = document.getElementById('pass-button');
export const consonantMatchButton = document.getElementById('consonant-match-button'); // 追加
export const messageArea = document.getElementById('message-area');
export const currentPlayerSpan = document.getElementById('current-player');
export const historyList = document.getElementById('history-list');
export const timeLeftDisplay = document.getElementById('time-left-display');