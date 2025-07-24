// public/scripts/eventListeners.js

import { handleWordSubmit, handlePass, handleConsonantMatch } from './gameLogic.js'; // handleConsonantMatch をインポート
import {
    submitButton, passButton, wordInput, consonantMatchButton // 追加
} from './domElements.js';

// =================================
// イベントリスナーの設定
// =================================

submitButton.addEventListener('click', handleWordSubmit);
passButton.addEventListener('click', handlePass);
consonantMatchButton.addEventListener('click', handleConsonantMatch); // 追加: 子音マッチボタン

wordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleWordSubmit();
    }
});