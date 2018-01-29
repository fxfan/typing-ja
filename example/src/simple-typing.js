const typing = require("../../src/typing-ja");

const newChallenge = (()=> {
  const questions = [
    "まよいマイマイ",
    "なでこメドゥーサ",
    "つばさキャット",
    "するがモンキー",
    "こよみヴァンプ",
    "しのぶマスタード",
    "かれんオウガ",
    "つきひフェニックス",
    "ひたぎエンド",
    "ですとぴあデスエデュケーション"
  ];
  return ()=> {
    const q = questions[Math.floor(Math.random() * questions.length)];
    return new typing.Sentence(q).newChallenge();
  };
})();

const showChallenge = (()=> {
  const $correct = document.getElementById("correct");
  const $mistype = document.getElementById("mistype");
  const $kana = document.getElementById("kana");
  const $roman = document.getElementById("roman");
  return ()=> {
    $correct.innerHTML = typingCount;
    $mistype.innerHTML = mistypingCount;
    $kana.innerHTML = challenge.text;
    $roman.innerHTML = `<span class="typed">${challenge.typedRoman}</span"><span class="remaining">${challenge.remainingRoman}</span>`;
  };
})();

let challenge = newChallenge();
let typingCount = 0;
let mistypingCount = 0;

showChallenge();

addEventListener("keydown", e => {
  challenge.input(e.key);
  if (challenge.isCleared()) {
    typingCount += challenge.typingCount;
    mistypingCount += challenge.mistypingCount;
    challenge = newChallenge();
  }
  showChallenge();
});


