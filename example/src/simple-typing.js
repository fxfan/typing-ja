const typing = require("../../src/typing-ja");

const newChallenge = (()=> {
  const questions = [
    "マヨイマイマイ",
    "ナデコメドゥーサ",
    "ツバサキャット",
    "スルガモンキー",
    "コヨミヴァンプ",
    "シノブマスタード",
    "カレンオウガ",
    "ツキヒフェニックス",
    "ヒタギエンド",
    "デストピアデスエデュケーション"
  ];
  return ()=> {
    const q = questions[Math.floor(Math.random() * questions.length)];
    return new typing.Sentence(q).newChallenge();
  };
})();

const showChallenge = (()=> {
  const $kana = document.getElementById("kana");
  const $roman = document.getElementById("roman");
  return (cha)=> {
    $kana.innerHTML = cha.text;
    $roman.innerHTML = `<span class="typed">${cha.typedRoman}</span"><span class="remaining">${cha.remainingRoman}</span>`;
  };
})();

let challenge = newChallenge();
showChallenge(challenge);

addEventListener("keydown", e => {
  challenge.input(e.key);
  if (challenge.isCleared()) {
    challenge = newChallenge();
  }
  showChallenge(challenge);
});


