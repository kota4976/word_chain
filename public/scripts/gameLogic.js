// public/scripts/gameLogic.js

import { hiraToKata, getLastCharForShiritori, getKanaRow } from './utils.js';
import {
    previousWordDisplay, wordInput, submitButton, resetButton, passButton,
    messageArea, currentPlayerSpan, historyList, timeLeftDisplay,
    modeSelectionScreen, gameScreen, 
    consonantMatchButton
} from './domElements.js';

// =================================
// ゲーム状態を管理する変数
// =================================
export let previousWord;
export let usedWords;
export let isGameOver;
export let playerCount;
export let currentPlayer;
export let playerPassUsed; // 各プレイヤーのパス使用状況を管理
export let playerConsonantMatchUsed; // 追加: 各プレイヤーの子音マッチ使用状況を管理
export let timeLimit;
export let timeLeft;
export let timerId;
export let charLimit;
export let consonantMatchMode; // モード選択で子音マッチが有効か
export let consonantMatchUsedThisTurn; // 現在のターンで子音マッチボタンが押されたか

// =================================
// ゲームのメインロジック
// =================================

export function updatePlayerDisplay() {
    currentPlayerSpan.textContent = currentPlayer;
}

export function nextPlayer() {
    currentPlayer = (currentPlayer % playerCount) + 1;
    updatePlayerDisplay();
    startTimer();
    
    // ターンが回ったら、コンソナントマッチが使われた状態をリセット
    consonantMatchUsedThisTurn = false;
    // 子音マッチモードが有効で、かつ現在のプレイヤーがまだ使っていない場合のみボタンを有効にする
    if (consonantMatchMode && !playerConsonantMatchUsed[currentPlayer]) {
        consonantMatchButton.disabled = false;
    } else {
        consonantMatchButton.disabled = true;
    }
    // パスボタンも現在のプレイヤーがまだ使っていない場合のみ有効にする
    if (!playerPassUsed[currentPlayer]) {
        passButton.disabled = false;
    } else {
        passButton.disabled = true;
    }
}

export function initializeGame(settings) {
    stopTimer();
    previousWord = 'しりとり';
    usedWords = [hiraToKata(previousWord)];
    isGameOver = false;

    playerCount = settings.playerCount;
    timeLimit = settings.timeLimit;
    charLimit = settings.charLimit;
    consonantMatchMode = settings.consonantMatchMode;

    consonantMatchUsedThisTurn = false;
    
    // playerPassUsedを初期化
    playerPassUsed = {};
    for (let i = 1; i <= playerCount; i++) {
        playerPassUsed[i] = false;
    }
    // playerConsonantMatchUsedを初期化
    playerConsonantMatchUsed = {};
    for (let i = 1; i <= playerCount; i++) {
        playerConsonantMatchUsed[i] = false;
    }

    passButton.disabled = false;
    
    currentPlayer = 1;
    previousWordDisplay.textContent = previousWord;
    messageArea.textContent = '';
    messageArea.className = '';
    wordInput.value = '';
    historyList.innerHTML = '';
    wordInput.disabled = false;
    submitButton.disabled = false;
    resetButton.disabled = false;

    // 子音マッチボタンの初期状態
    if (consonantMatchMode) {
        consonantMatchButton.classList.remove('hidden');
        consonantMatchButton.disabled = false;
    } else {
        consonantMatchButton.classList.add('hidden');
        consonantMatchButton.disabled = true;
    }

    updatePlayerDisplay();
    wordInput.focus();
    startTimer();
}

export function endGame(message) {
    isGameOver = true;
    messageArea.textContent = message;
    messageArea.className = 'game-over';
    wordInput.disabled = true;
    submitButton.disabled = true;
    passButton.disabled = true;
    consonantMatchButton.disabled = true;
    stopTimer();
    resetButton.disabled = false;
}

export function startTimer() {
    stopTimer();
    if (timeLimit === 0) {
        timeLeftDisplay.textContent = '--';
        return;
    }

    timeLeft = timeLimit;
    timeLeftDisplay.textContent = timeLeft;

    timerId = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 5) {
            timeLeftDisplay.style.color = 'red';
        } else {
            timeLeftDisplay.style.color = '#333';
        }

        if (timeLeft <= 0) {
            endGame('時間切れです！ゲームオーバー！');
        }
    }, 1000);
}

export function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        timeLeftDisplay.textContent = '--';
        timeLeftDisplay.style.color = '#333';
    }
}

export async function handleWordSubmit() {
    if (isGameOver) return;

    stopTimer();

    const rawNewWord = wordInput.value.trim();
    if (!rawNewWord) {
        startTimer();
        return;
    }

    messageArea.textContent = '';
    messageArea.className = '';

    const hiraganaRegex = /^[ぁ-んー]+$/;
    if (!hiraganaRegex.test(rawNewWord)) {
        messageArea.textContent = 'エラー：ひらがなで入力してください。';
        messageArea.className = 'error';
        startTimer();
        return;
    }

    if (charLimit > 0 && rawNewWord.length > charLimit) {
        endGame(`エラー：${charLimit}文字以内で入力してください。ゲームオーバー！`);
        return;
    }

    const newWordInKata = hiraToKata(rawNewWord);
    
    try {
        const response = await fetch(`/check-word?word=${encodeURIComponent(rawNewWord)}`);
        const data = await response.json();
        if (!data.exists) {
            messageArea.textContent = 'エラー：その単語は存在しないか、使えません。';
            messageArea.className = 'error';
            startTimer();
            return;
        }
    } catch (error) {
        console.error('Error calling Python API:', error);
        messageArea.textContent = 'エラー：単語のチェック中に問題が発生しました。';
        messageArea.className = 'error';
        startTimer();
        return;
    }

    const previousWordInKata = hiraToKata(previousWord);
    const lastCharOfPrevWord = getLastCharForShiritori(previousWordInKata);
    const firstCharOfNewWord = newWordInKata.charAt(0);

    let shiritoriRuleMet = false;

    if (consonantMatchUsedThisTurn) { // 子音マッチボタンが押されている場合
        const prevWordKanaRow = getKanaRow(lastCharOfPrevWord);
        const newWordKanaRow = getKanaRow(firstCharOfNewWord);

        if (prevWordKanaRow && newWordKanaRow && prevWordKanaRow === newWordKanaRow) {
            shiritoriRuleMet = true;
            // この場合、子音マッチ機能はそのプレイヤーが使用済みとなる
            playerConsonantMatchUsed[currentPlayer] = true; 
            messageArea.textContent = '子音マッチルールで接続しました！';
            messageArea.className = 'info';
        } else {
            messageArea.textContent = `エラー：子音マッチルールでは繋がりません。「${lastCharOfPrevWord}」と同じ行の単語を入力してください。`;
            messageArea.className = 'error';
            startTimer();
            consonantMatchButton.disabled = false; // ボタンを再有効化
            consonantMatchUsedThisTurn = false; // このターンでの子音マッチ使用フラグをリセット
            return;
        }
    } else { // 通常のしりとりルール
        if (lastCharOfPrevWord === firstCharOfNewWord) {
            shiritoriRuleMet = true;
        }
    }

    if (!shiritoriRuleMet) {
        messageArea.textContent = `エラー：「${lastCharOfPrevWord}」から始まる単語を入力してください。`;
        wordInput.value = '';
        startTimer();
        return;
    }

    if (newWordInKata.slice(-1) === 'ン') {
        endGame('「ン」で終わりました。ゲームオーバー！');
        previousWordDisplay.textContent = rawNewWord;
        return;
    }
    if (usedWords.includes(newWordInKata)) {
        endGame('その単語は既に使用されています。ゲームオーバー！');
        return;
    }

    previousWord = rawNewWord;
    usedWords.push(newWordInKata);
    previousWordDisplay.textContent = previousWord;
    
    const newHistoryItem = document.createElement('li');
    newHistoryItem.innerHTML = `<span class="player-id">P${currentPlayer}:</span> ${rawNewWord}`;
    historyList.prepend(newHistoryItem);
    
    wordInput.value = '';
    wordInput.focus();
    
    nextPlayer();
}

export function handlePass() {
    if (isGameOver) return;
    if (playerPassUsed[currentPlayer]) {
        messageArea.textContent = `P${currentPlayer} は既にパスを使用しました！`;
        messageArea.className = 'error';
        return;
    }
    playerPassUsed[currentPlayer] = true;
    messageArea.textContent = `P${currentPlayer} はパスしました。`;
    messageArea.className = 'info';
    wordInput.value = '';
    
    passButton.disabled = true; // 現在のプレイヤーはパスを使用済みなので無効にする

    nextPlayer();
}

export function handleConsonantMatch() {
    if (isGameOver) return;
    if (!consonantMatchMode) {
        messageArea.textContent = '子音マッチモードは有効ではありません。';
        messageArea.className = 'error';
        return;
    }
    if (playerConsonantMatchUsed[currentPlayer]) { // 現在のプレイヤーが既に子音マッチを使っているかチェック
        messageArea.textContent = `P${currentPlayer} は既に子音マッチを使用しました！`;
        messageArea.className = 'error';
        return;
    }
    if (consonantMatchUsedThisTurn) {
        messageArea.textContent = '既に子音マッチモードが有効です。単語を入力してください。';
        messageArea.className = 'info';
        return;
    }

    consonantMatchUsedThisTurn = true;
    consonantMatchButton.disabled = true; // ボタンを無効にする（入力が成功するまで有効にならない）

    messageArea.textContent = `子音マッチモードが有効になりました。単語を入力してください。`;
    messageArea.className = 'info';
    wordInput.focus();
    startTimer();
}

export function resetGameToModeSelection() {
    stopTimer();
    isGameOver = true;

    gameScreen.classList.add('hidden');
    modeSelectionScreen.classList.remove('hidden');
}