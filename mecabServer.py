from flask import Flask, request, jsonify
from flask_cors import CORS # Denoからアクセスする場合、この行は不要になるが残っていてもOK
import MeCab

def hira_to_kata(text: str) -> str:
    """ひらがなをカタカナに変換する"""
    return "".join([chr(ord(c) + 96) if "ぁ" <= c <= "ん" else c for c in text])

def kata_to_hira(text: str) -> str:
    """カタカナをひらがなに変換する"""
    return "".join([chr(ord(c) - 96) if "ァ" <= c <= "ヶ" else c for c in text])

# --- MeCabの単語チェックロジック ---
MECABRC_PATH = "/opt/homebrew/etc/mecabrc" # あなたの環境に合わせてパスを修正してください
DIC_DIR_PATH = "/opt/homebrew/lib/mecab/dic/ipadic" # あなたの環境に合わせてパスを修正してください
try:
    tagger = MeCab.Tagger(f"-r {MECABRC_PATH} -d {DIC_DIR_PATH}")
except Exception as e:
    print("MeCabの初期化に失敗しました。パスが正しいか確認してください。")
    raise e
ACCEPTABLE_POS = ['名詞', '動詞', '形容詞', '副詞', '感動詞', '連体詞']
def check_word_mecab(word: str) -> bool:
    if not word:
        return False
    if len(word) >= 3 and all(c == word[0] for c in word):
        return False
    lines = [line for line in tagger.parse(word).splitlines() if line and line != 'EOS']
    if len(lines) != 1:
        return False
    parts = lines[0].split('\t')
    if len(parts) < 2:
        return False
    first_pos = parts[1].split(',')[0]
    return first_pos in ACCEPTABLE_POS
# ------------------------------------

app = Flask(__name__)
CORS(app) # Denoからアクセスする場合、この行は不要になるが残っていてもOK

@app.route('/check')
def handle_check_word():
    word = request.args.get('word', '')
    exists = False
    if word:
        exists = check_word_mecab(word)
        if not exists:
            is_hiragana = "ぁ" <= word[0] <= "ん"
            if is_hiragana:
                converted_word = hira_to_kata(word)
                exists = check_word_mecab(converted_word)
            else:
                converted_word = kata_to_hira(word)
                if word != converted_word:
                    exists = check_word_mecab(converted_word)
    return jsonify({ "exists": exists })

if __name__ == '__main__':
    # Denoがこのポートにアクセスするので、固定しておく
    app.run(port=5000)