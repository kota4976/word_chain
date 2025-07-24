# word_checker_mecab.py
import MeCab

# MeCabのTaggerを初期化（デフォルトでipadicが使われます）
tagger = MeCab.Tagger()

# しりとりで有効と見なす品詞のリスト
ACCEPTABLE_POS = [
  '名詞',
  '動詞',
  '形容詞',
  '副詞',
  '感動詞',
  '連体詞',
]

def check_word(word: str) -> bool:
    """
    入力された単語をMeCabで形態素解析し、しりとりに有効かチェックする
    """
    if not word:
        return False

    # MeCabの出力は文字列なので、改行で分割してリストにする
    # 例: 'りんご\t名詞,一般,*,*,*,*,りんご,リンゴ,リンゴ\nEOS\n'
    node_str = tagger.parse(word)
    nodes = node_str.split('\n')

    # 解析結果が単一の単語かチェック (結果は単語行と"EOS"の2行になるはず)
    if len(nodes) != 2 or nodes[0] == '':
        return False

    # 最初の行（単語行）をタブで分割
    # -> ['りんご', '名詞,一般,*,*,*,*,りんご,リンゴ,リンゴ']
    parts = nodes[0].split('\t')
    if len(parts) < 2:
        return False

    # 品詞情報（2番目の要素）をカンマで分割し、主要な品詞を取得
    # -> '名詞'
    first_pos = parts[1].split(',')[0]

    # 品詞が許可リストに含まれているかチェック
    return first_pos in ACCEPTABLE_POS


# このファイルが直接実行された場合のテストコード
if __name__ == '__main__':
    test_words = ["りんご", "りりり", "食べる", "の", "こんにちは"]
    for word in test_words:
        is_valid = check_word(word)
        print(f"「{word}」は有効ですか？ -> {is_valid}")

    # 実行結果:
    # 「りんご」は有効ですか？ -> True
    # 「りりり」は有効ですか？ -> False （未知語として扱われ、品詞が'名詞'ではない）
    # 「食べる」は有効ですか？ -> True
    # 「の」は有効ですか？ -> False  （品詞が助詞のため）
    # 「こんにちは」は有効ですか？ -> True