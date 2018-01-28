# typing-ja

日本語タイピングソフトのコアとなるロジックを提供するnodeモジュールです。

カナは、ある1文字に対応するアルファベットのならびが複数パターン存在することもありますし、また拗音では2文字に対して特定のアルファベット列が対応付けられたりもします。「っ」「ん」のように次に続く文字によってアルファベットが変化する文字もあります。

たとえば、「にゃんこ」という単語は、標準的には`nyanko`と入力されつつも、たとえば`nilyannco`という入力も許容されます。`n`の次の入力として`y`だけでなく`i`も受理しつつ、その時点で更に次の入力としては`l`か`x`のいずれかのみを受理するように状態を変化させる必要があります。

このライブラリは、日本語文字列（平仮名またはカタカナ）を入力すると、それをタイピング入力可能なアルファベット列の全パターンを受理するオートマトンを生成します。

# インストール

```
npm install typing-ja
```

# 使いかた

## `Sentence` と `Kana`

`Sentence` オブジェクトがひとつの入力フレーズを表し、 `Kana` オブジェクトがフレーズ内の一つひとつの入力単位を表します。ほとんどのカナはひと文字がひとつの `Kana` オブジェクトに対応しますが、拗音はまとめてひとつの `Kana` オブジェクトとして扱われます。それ以外の特殊な文字（「ン」「ッ」「ー」など）もそれぞれがひとつの `Kana` オブジェクトです。下記例では「ニャ」はひとつの `Kana` オブジェクトとして扱われているのがわかります。

この両クラスはイミュータブルです。

```javascript
// Sentenceオブジェクト作成
const sentence = new Sentence("ニャンコ");

// Kanaオブジェクトの配列を取得
const kanas = sentence.kanas;
console.log(kanas[0].getDefaultRoman()) // "nya"
console.log(kanas[1].getDefaultRoman()) // "n"
console.log(kanas[2].getDefaultRoman()) // "ko"
```

## `Challenge`
不変なある `Sentence` オブジェクトに対して、そのフレーズを入力しようとする試みをチャレンジと呼び、 `Challenge` オブジェクトで表されます。オブジェクトは次のようにして生成できます。

```javascript
const challenge = sentence.newChallenge();
```

`Challenge` オブジェクトは文字（アルファベット）の入力に反応して状態を変化させます。タイピングソフトを作る上で必要な機能の大部分はこのクラスが提供します。

```javascript
const sentence = new Sentence("ニャンコ")
const challenge = sentence.newChallenge();

console.log(challenge.typedRoman); // "" ここまでに入力し受理されたアルファベット列
console.log(challenge.remainingRoman); // "nyanko" 入力が必要なアルファベット列

challenge.input("a"); // a は受け付けない。falseを返す
challenge.input("n"); // n を受け付け、trueを返す

// nが受理されたことにより残りの要入力アルファベット列も変化する
console.log(challenge.typedRoman); // "n"
console.log(challenge.remainingRoman); // "yanko" 

// 期待される入力[y]とは異なるが受理可能な入力
challenge.input("i"); // i を受け付け、trueを返す

// iが受理されたことにより残りの要入力アルファベット列が変化する
console.log(challenge.typedRoman); // "ni"
console.log(challenge.remainingRoman); // "lyanko"

// タイプ数・ミスタイプ数
console.log("正しい入力の数: " + challenge.typingCount); // 2
console.log("ミスタイプの数: " + challenge.mistypingCount); // 1

// すべての入力が終わっているかどうか
console.log(challenge.isCleared()); // false

challenge.input("l");
challenge.input("y");
challenge.input("a");
challenge.input("n");
challenge.input("k");
challenge.input("o");
console.log(challenge.isCleared()); // true
```

## カナとローマ字のマッピング

`Kana.mapping` プロパティに、カナとローマ字のマッピングが格納されています。マッピングはカタカナ1文字または2文字をキーとし、それを入力可能なアルファベット列の配列と値とします。また、値の配列のうち先頭がデフォルトのアルファベット列で、 `challenge.remainingRoman` の表示などで優先的に用いられます。

```javascript
console.log(JSON.strinfigy(Kana.mapping, null, "  "));
// {
//   "ア": ["a"],
//   "イ": ["i"],
//   "ウ": ["u", "wu", "whu"],
//   "エ": ["e"],
//   "オ": ["o"],
// ...

Kana.mapping["コ"] = ["co", "ko"]; // "ko" と "co" を入れ替えた
const sentence = new Sentence("ニャンコ");
console.log(sentence.getDefaultRoman()); // "nyanco" と出力。 "ko" が "co" に変わった 
```

