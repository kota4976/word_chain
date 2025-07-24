// public/script.js

import { initializeGame, resetGameToModeSelection } from './scripts/gameLogic.js';
import {
    modeSelectionScreen, gameScreen, startGameButton,
    playerCountSelectMode, timeLimitSelectMode, charLimitSelectMode, consonantMatchModeCheckbox,
    resetButton,
    consonantMatchButton
} from './scripts/domElements.js';

// ゲーム開始ボタンのイベントリスナー
startGameButton.addEventListener('click', () => {
    const settings = {
        playerCount: parseInt(playerCountSelectMode.value, 10),
        timeLimit: parseInt(timeLimitSelectMode.value, 10),
        charLimit: parseInt(charLimitSelectMode.value, 10),
        consonantMatchMode: consonantMatchModeCheckbox.checked
    };

    modeSelectionScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    if (settings.consonantMatchMode) {
        consonantMatchButton.classList.remove('hidden');
    } else {
        consonantMatchButton.classList.add('hidden');
    }

    initializeGame(settings);
});

// ゲーム画面のリセットボタン (モード選択に戻る)
resetButton.addEventListener('click', resetGameToModeSelection);

// 初期表示はモード選択画面
document.addEventListener('DOMContentLoaded', () => {
    modeSelectionScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
});