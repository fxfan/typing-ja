const am = require("dfa.js");

const Fragment = am.Fragment
const Regex = am.Regex

class Sentence {

  constructor(text) {

    if (text === null || text === undefined) {
      throw "Parameter 'text' is required";
    }
    
    this.text = text;

    // カタカナのシーケンスとひとつ前（つまり並び順でいうとひとつ後ろ）に取得したKanaオブジェクトを渡し、
    // カタカナシーケンスから次のKanaオブジェクトと、その残りの部分を返す
    const tailKana = (text, prevKana)=> {
      if (text.length > 1) {
        const chs = text.slice(-2);
        if (Kana.mapping[chs]) {
          return [ new Kana.Double(this, chs), text.slice(0, -2) ]
        }
      }
      const ch = text.slice(-1);
      const remain = text.slice(0, -1);
      switch (ch) {
        case "ッ":
          return [ new Kana.Ltu(this, prevKana), remain ]
        case "ン":
          return [ new Kana.N(this, prevKana), remain ]
        default:
          return [ new Kana.Single(this, ch), remain ];
      }
    };

    const toKanaArray = (text, prevKana = null)=> {
      switch (text.length) {
        case 0: return []
        default:
          const [ kana, remain ] = tailKana(text, prevKana);
          return toKanaArray(remain, kana).concat(kana);
      }
    };

    this.kanas = Object.freeze(toKanaArray(text));
    return Object.freeze(this);
  }

  getDefaultRoman() {
    return this.kanas.reduce((s, kana)=> {
      return s + kana.getDefaultRoman();
    }, "");
  }

  // 指定したカナより後ろ（指定したカナを含まない）のカナ全てのデフォルトローマ字をつなげて返す。
  getDefaultRomanAfter(kana) {
    return this.kanas.slice(this.kanas.indexOf(kana) + 1).reduce((s, kana)=> {
      return s + kana.getDefaultRoman();
    }, "");
  }
}

Sentence.test = function(s) {
  const sentence = new Sentence(s);
  return [sentence.getDefaultRoman()].concat(sentence.kanas.map(kana => kana.getDefaultRomanAfterThis()));
};


// ひとつのカナを表す
// ただし、ここでいう「ひとつ」とはローマ字に変換する際の最小単位であり、
// 拗音はひとつのKanaオブジェクトとして扱う
// また、「っ」と「ん」はそれぞれひとつのKanaオブジェクトとして扱う
class Kana {

  constructor(sentence) {
    this.sentence = sentence;
  }

  getDefaultRoman() {
    throw "unsupported operation";
  }

  getDefaultRomanAfterThis() {
    return this.sentence.getDefaultRomanAfter(this);
  }

  getNFAFragment() {
    throw "getNFAFragment() must be implemented by subclasses.";
  } 

  static tails(text) {
    const _tails = (text)=> {
      switch (text.length) {
        case 0: return [];
        default: return [text].concat(_tails(text.slice(1)));
      }
    };
    return _tails(text);
  }

  static romanToFragment(roman) {

    const seq = am.StateNumSequence.newSequence();
    const last = new am.State(seq.next(), []).toAcceptable(roman);

    const states = Kana.tails(roman).reduce((states, tail) => {
      const edge = new am.Edge(new am.CharLabel.Single(tail.charAt(0)), last.num);
      const state = new am.State(seq.next(), [edge], { "tail": tail });
      if (states.length > 0) {
        const prevState = states[states.length - 1];
        states[states.length - 1] = prevState.changeEdgesDest(last.num, state.num);
      }
      return states.concat(state)
    }, []);

    return new am.Fragment(states.concat(last));
  }

}

Kana.Single = class Kana_Single extends Kana {

  constructor(sentence, ch) {
    super(sentence);
    this.ch = ch;
    this.romans = Object.freeze(Kana.mapping[ch]);
    return Object.freeze(this);
  }

  getDefaultRoman() {
    return this.romans[0];
  }

  getNFAFragment() {
    const frags = this.romans.map(roman => Kana.romanToFragment(roman));
    return Fragment.mergeAll(frags);
  }
}

Kana.Double = class Kana_Double extends Kana {

  constructor(sentence, chs) {
    super(sentence);
    this.chs = chs;
    this.romans = Kana.mapping[chs];
  }

  getDefaultRoman() {
    return this.romans[0];
  }

  getNFAFragment() {
    // this.romansそれぞれについてFragmentを生成
    const frags1 = this.romans.map(roman => Kana.romanToFragment(roman));

    // chsを2文字に分割し、
    //  1文字目のromansに対応するFragmentリストを作る
    //  そのそれぞれについて、2文字目のromansをマージしてできたFragmentを連結したFragmentを生成
    const second = Fragment.mergeAll(Kana.mapping[this.chs[1]].map(roman => Kana.romanToFragment(roman)));
    const frags2 = Kana.mapping[this.chs[0]].map(roman => Kana.romanToFragment(roman).concat(second));

    return Fragment.mergeAll(frags1.concat(frags2));
  }

}

Kana.Ltu = class Kana_Ltu extends Kana {

  constructor(sentence, prev) {
    super(sentence);
    this.prev = prev;
    this.romans = ["ltu", "xtu", "ltsu", "xtsu"];
  }

  // 「っ」は、後ろにカナが続き、かつそれがア行でもナ行でもない場合、後ろのカナのローマ字の子音先頭ひと文字を重ねる
  // そうでない場合は単独入力する
  getDefaultRoman() {
    if (this.prev) {
      const c = this.prev.getDefaultRoman().charAt(0);
      if (!"aiueon".includes(c)) {
        return c;
      }
    }
    return this.romans[0];
  }

  getNFAFragment() {
    const frags = [];
    if (this.prev) {
      const c = this.prev.getDefaultRoman().charAt(0);
      if (!"aiueon".includes(c)) {
        frags.push(Kana.romanToFragment(c));
      }
    }
    return Fragment.mergeAll(frags.concat(this.romans.map(roman => Kana.romanToFragment(roman))));
  }
}

Kana.N = class Kana_N extends Kana {
  
  constructor(sentence, prev) {
    super(sentence);
    this.prev = prev;
    this.allowSingleN = prev && !"aiueony".includes(prev.getDefaultRoman().charAt(0));
  }

  // 「ん」は、後ろにカナが続き、かつそれがア行でもナ行でもヤ行でもない場合、nひとつでも許される
  // そうでない場合はnnと重ねる必要がある
  getDefaultRoman() {
    return this.allowSingleN ? "n" : "nn";
  }

  getNFAFragment() {
    if (this.allowSingleN) {
      return Fragment.mergeAll(["n", "nn"].map(roman => Kana.romanToFragment(roman)));
    } else {
      return Kana.romanToFragment("nn");
    }
  }
}

// http://gontyping.com/input-method/maniac.html を参考に
// Google日本語入力で変換できないものは除外した
Kana.DEFAULT_KANA_MAPPING = Object.freeze({
  "ア": ["a"],
  "イ": ["i"],
  "ウ": ["u", "wu", "whu"],
  "エ": ["e"],
  "オ": ["o"],
  "カ": ["ka", "ca"],
  "キ": ["ki"],
  "ク": ["ku", "cu", "qu"],
  "ケ": ["ke"],
  "コ": ["ko", "co"],
  "サ": ["sa"],
  "シ": ["si", "shi", "ci"],
  "ス": ["su"],
  "セ": ["se", "ce"],
  "ソ": ["so"],
  "タ": ["ta"],
  "チ": ["ti", "chi"],
  "ツ": ["tu", "tsu"],
  "テ": ["te"],
  "ト": ["to"],
  "ナ": ["na"],
  "ニ": ["ni"],
  "ヌ": ["nu"],
  "ネ": ["ne"],
  "ノ": ["no"],
  "ハ": ["ha"],
  "ヒ": ["hi"],
  "フ": ["hu", "fu"],
  "ヘ": ["he"],
  "ホ": ["ho"],
  "マ": ["ma"],
  "ミ": ["mi"],
  "ム": ["mu"],
  "メ": ["me"],
  "モ": ["mo"],
  "ヤ": ["ya"],
  "ユ": ["yu"],
  "ヨ": ["yo"],
  "ラ": ["ra"],
  "リ": ["ri"],
  "ル": ["ru"],
  "レ": ["re"],
  "ロ": ["ro"],
  "ワ": ["wa"],
  "ヲ": ["wo"],
  "ガ": ["ga"],
  "ギ": ["gi"],
  "グ": ["gu"],
  "ゲ": ["ge"],
  "ゴ": ["go"],
  "ザ": ["za"],
  "ジ": ["zi", "ji"],
  "ズ": ["zu"],
  "ゼ": ["ze"],
  "ゾ": ["zo"],
  "ダ": ["da"],
  "ヂ": ["di"],
  "ヅ": ["du"],
  "デ": ["de"],
  "ド": ["do"],
  "バ": ["ba"],
  "ビ": ["bi"],
  "ブ": ["bu"],
  "ベ": ["be"],
  "ボ": ["bo"],
  "パ": ["pa"],
  "ピ": ["pi"],
  "プ": ["pu"],
  "ペ": ["pe"],
  "ポ": ["po"],
  "ヴ": ["vu"],
  "ー": ["-"],
  "ァ": ["la", "xa"],
  "ィ": ["li", "xi", "lyi", "xyi"],
  "ゥ": ["lu", "xu"],
  "ェ": ["le", "xe", "lye", "xye"],
  "ォ": ["lo", "xo"],
  "ヵ": ["lka", "xka"],
  "ヶ": ["lke", "xke"],
  "ヮ": ["lwa", "xwa"],
  "ャ": ["lya", "xya"],
  "ュ": ["lyu", "xyu"],
  "ョ": ["lyo", "xyo"],
  "キャ": ["kya"],
  "キィ": ["kyi"],
  "キュ": ["kyu"],
  "キェ": ["kye"],
  "キョ": ["kyo"],
  "シャ": ["sya", "sha"],
  "シィ": ["syi"],
  "シュ": ["syu", "shu"],
  "シェ": ["sye", "she"],
  "ショ": ["syo", "sho"],
  "チャ": ["tya", "cha", "cya"],
  "チィ": ["tyi", "cyi"],
  "チュ": ["tyu", "chu", "cyu"],
  "チェ": ["tye", "che", "cye"],
  "チョ": ["tyo", "cho", "cyo"],
  "ニャ": ["nya"],
  "ニィ": ["nyi"],
  "ニュ": ["nyu"],
  "ニェ": ["nye"],
  "ニョ": ["nyo"],
  "ヒャ": ["hya"],
  "ヒィ": ["hyi"],
  "ヒュ": ["hyu"],
  "ヒェ": ["hye"],
  "ヒョ": ["hyo"],
  "ミャ": ["mya"],
  "ミィ": ["myi"],
  "ミュ": ["myu"],
  "ミェ": ["mye"],
  "ミョ": ["myo"],
  "リャ": ["rya"],
  "リィ": ["ryi"],
  "リュ": ["ryu"],
  "リェ": ["rye"],
  "リョ": ["ryo"],
  "ギャ": ["gya"],
  "ギィ": ["gyi"],
  "ギュ": ["gyu"],
  "ギェ": ["gye"],
  "ギョ": ["gyo"],
  "ジャ": ["ja", "jya", "zya"],
  "ジィ": ["jyi", "zyi"],
  "ジュ": ["ju", "jyu", "zyu"],
  "ジェ": ["je", "jye", "zye"],
  "ジョ": ["jo", "jyo", "zyo"],
  "ビャ": ["bya"],
  "ビィ": ["byi"],
  "ビュ": ["byu"],
  "ビェ": ["bye"],
  "ビョ": ["byo"],
  "ピャ": ["pya"],
  "ピィ": ["pyi"],
  "ピュ": ["pyu"],
  "ピェ": ["pye"],
  "ピョ": ["pyo"],
  "イェ": ["ye"],
  "ウァ": ["wha"],
  "ウィ": ["whi", "wi"],
  "ウェ": ["whe", "we"],
  "ウォ": ["who"],
  "クァ": ["qa", "kwa"],
  "クィ": ["qi"],
  "クェ": ["qe"],
  "クォ": ["qo"],
  "ツァ": ["tsa"],
  "ツィ": ["tsi"],
  "ツェ": ["tse"],
  "ツォ": ["tso"],
  "テャ": ["tha"],
  "ティ": ["thi"],
  "テュ": ["thu"],
  "テェ": ["the"],
  "テョ": ["tho"],
  "トァ": ["twa"],
  "トィ": ["twi"],
  "トゥ": ["twu"],
  "トェ": ["twe"],
  "トォ": ["two"],
  "ファ": ["fa"],
  "フィ": ["fi"],
  "フェ": ["fe"],
  "フォ": ["fo"],
  "フャ": ["fya"],
  "フュ": ["fyu"],
  "フョ": ["fyo"],
  "グァ": ["gwa"],
  "グィ": ["gwi"],
  "グゥ": ["gwu"],
  "グェ": ["gwe"],
  "グォ": ["gwo"],
  "ヂャ": ["dya"],
  "ヂィ": ["dyi"],
  "ヂュ": ["dyu"],
  "ヂェ": ["dye"],
  "ヂョ": ["dyo"],
  "デャ": ["dha"],
  "ディ": ["dhi"],
  "デュ": ["dhu"],
  "デェ": ["dhe"],
  "デョ": ["dho"],
  "ドァ": ["dwa"],
  "ドィ": ["dwi"],
  "ドゥ": ["dwu"],
  "ドェ": ["dwe"],
  "ドォ": ["dwo"],
  "ヴァ": ["va"],
  "ヴィ": ["vi", "vyi"],
  "ヴェ": ["ve", "vye"],
  "ヴォ": ["vo"],
  "ヴャ": ["vya"],
  "ヴュ": ["vyu"],
  "ヴョ": ["vyo"]
});
Kana.mapping = Object.assign({}, Kana.DEFAULT_KANA_MAPPING);


module.exports = {
  Sentence: Sentence,
  Kana: Kana
};
