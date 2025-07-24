// public/scripts/utils.js

export function hiraToKata(str) {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

export function getLastCharForShiritori(word) {
  const lastChar = word.slice(-1);
  const smallToLarge = { 'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ', 'ッ': 'ツ', 'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ' };

  if (smallToLarge[lastChar]) {
    return smallToLarge[lastChar];
  }
  if (lastChar === 'ー') {
    return word.slice(-2, -1);
  }
  return lastChar;
}

// 子音（行）を取得するヘルパー関数
// 「あ」行、「か」行などの行名を返す
export function getKanaRow(char) {
    const charCode = char.charCodeAt(0);

    // ひらがな範囲 'ぁ' (0x3041) - 'ん' (0x3093)
    // カタカナ範囲 'ァ' (0x30A1) - 'ン' (0x30F3)

    // 文字列をひらがなに変換して処理
    const hiraChar = String.fromCharCode(charCode >= 0x30A1 && charCode <= 0x30F6 ? charCode - 0x60 : charCode);

    if (hiraChar >= 'あ' && hiraChar <= 'お') return 'a'; // あ行
    if (hiraChar >= 'か' && hiraChar <= 'こ' || hiraChar === 'が' || hiraChar === 'ぎ' || hiraChar === 'ぐ' || hiraChar === 'げ' || hiraChar === 'ご') return 'k'; // か行
    if (hiraChar >= 'さ' && hiraChar <= 'そ' || hiraChar === 'ざ' || hiraChar === 'じ' || hiraChar === 'ず' || hiraChar === 'ぜ' || hiraChar === 'ぞ') return 's'; // さ行
    if (hiraChar >= 'た' && hiraChar <= 'と' || hiraChar === 'だ' || hiraChar === 'ぢ' || hiraChar === 'づ' || hiraChar === 'で' || hiraChar === 'ど') return 't'; // た行
    if (hiraChar >= 'な' && hiraChar <= 'の') return 'n'; // な行
    if (hiraChar >= 'は' && hiraChar <= 'ほ' || hiraChar === 'ば' || hiraChar === 'び' || hiraChar === 'ぶ' || hiraChar === 'べ' || hiraChar === 'ぼ' || hiraChar === 'ぱ' || hiraChar === 'ぴ' || hiraChar === 'ぷ' || hiraChar === 'ぺ' || hiraChar === 'ぽ') return 'h'; // は行
    if (hiraChar >= 'ま' && hiraChar <= 'も') return 'm'; // ま行
    if (hiraChar >= 'や' && hiraChar <= 'よ') return 'y'; // や行 (半母音として扱う)
    if (hiraChar >= 'ら' && hiraChar <= 'ろ') return 'r'; // ら行
    if (hiraChar >= 'わ' && hiraChar <= 'を') return 'w'; // わ行 (半母音として扱う)
    if (hiraChar === 'ん') return 'n'; // ん

    // 拗音、促音、長音記号などの特殊文字に対応
    const smallToLarge = {
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
        'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'っ': 'つ', // 促音は「つ」行の子音として扱う
    };
    if (smallToLarge[hiraChar]) {
        // 小さい文字は大きい文字の行に属すると見なす
        return getKanaRow(smallToLarge[hiraChar]);
    }
    if (hiraChar === 'ー') { // 長音記号は無視するか、前の文字の行に属すと見なす
        return ''; // ここでは空文字列を返して、呼び出し側で適切に処理させる
    }

    return ''; // その他の文字は空文字列を返す
}

// 拗音・促音に対応するための改良版 getLastCharForShiritori
// 「きゃ」→「や」、「がっこう」→「う」
export function getLastCharForShiritoriStrict(word) {
    let lastChar = word.slice(-1);

    // 拗音・促音の変換
    const smallToLarge = { 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お', 'っ': 'つ', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ' };
    if (smallToLarge[lastChar]) {
        lastChar = smallToLarge[lastChar];
    }
    
    // 長音記号 'ー' の処理
    if (lastChar === 'ー') {
        if (word.length >= 2) {
            // 長音記号の前の文字の子音に合わせる
            lastChar = word.slice(-2, -1);
            if (smallToLarge[lastChar]) { // 長音記号の前の文字が拗音だった場合
                lastChar = smallToLarge[lastChar];
            }
        } else {
            return ''; // 長音記号のみの場合は不正な終了
        }
    }

    // 「ん」で終わる場合はゲームオーバーなので、ここでは判定せず、呼び出し元で処理
    return lastChar;
}