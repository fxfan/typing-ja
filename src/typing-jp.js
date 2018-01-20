const dfa = require("dfa.js");

class KanaSequence {

  constructor(word) {
    
    this.word = word;

    // カタカナのシーケンスとひとつ前（つまり並び順でいうとひとつ後ろ）に取得したKanaオブジェクトを渡し、
    // カタカナシーケンスから次のKanaオブジェクトと、その残りの部分を返す
    const tailKana = (word, prevKana)=> {
      if (word.length > 1) {
        const chs = word.slice(-2);
        if (Kana.mapping[chs]) {
          return [ new Kana.Double(this, chs), word.slice(0, -2) ]
        }
      }
      const ch = word.slice(-1);
      const remain = word.slice(0, -1);
      switch (ch) {
        case "ッ":
          return [ new Kana.Ltu(this, prevKana), remain ]
        case "ン":
          return [ new Kana.Nn(this, prevKana), remain ]
        default:
          return [ new Kana.Single(this, ch), remain ];
      }
    };

    const toKanaArray = (word, prevKana = null)=> {
      switch (word.length) {
        case 0: return []
        default:
          const [ kana, remain ] = tailKana(word, prevKana);
          return toKanaArray(remain, kana).concat(kana);
      }
    };

    this.kanas = toKanaArray(word);
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

KanaSequence.test = function(s) {
  const seq = new KanaSequence(s);
  return [seq.getDefaultRoman()].concat(seq.kanas.map(kana => kana.getDefaultRomanAfterThis()));
};

class KanaState extends dfa.State {
  constructor(num, edges) {
    super(num, edges);
  }
}

class DFAPart {

  // statesのうち最後のstateに、次のDFAPartがつながる
  constructor(firstEdges, states) {
    this.firstEdges = firstEdges;
    this.states = states;
  }

  appendTo(dfa, stateNum) {
    const state = dfa.getStateByNum(stateNum);
    state.edges = state.edges.concat(this.firstEdges);
    this.states.forEach(s => dfa.addState(s));
  }

  // 2つのDFAPartのマージした新しいDFAPartを返す
  // エントリポイントとなるedgesは連結される
  // 両DFAPartの最後のstateはひとつに統合される
  merge(other) {

    const firstEdges = this.firstEdges.concat(other.firstEdges);

    // this.statesにother.statesをコピーする
    // ただし、other.statesのうち、other.statesの最後のstateにつながるedgeは、
    // this.statesの最後のstateにつながるようにdestを変更し、
    // other.statesの最後のstateはどこからも遷移しないのでコピー対象外とする
    const thisLast = this.states[this.states.length - 1];
    const otherLast = other.states[other.states.length - 1];
    const states = other.states.reduce((states, state)=> {
      state.edges.forEach(e => {
        if (e.dest === otherLast.num) {
          e.dest = thisLast.num;
        }
      });
      return state === otherLast ? states : states.concat(state);
    }, this.states);

    return new DFAPart(firstEdges, states);
  }

  // partsのうち最初のひとつをベースとし、すべてのDFAPartをマージする
  static mergeAll(parts) {
    parts = parts.slice();
    const first = parts.shift();
    return parts.reduce((base, part)=> base.merge(part), first);
  }

}

// ひとつのカナを表す
// ただし、ここでいう「ひとつ」とはローマ字に変換する際の最小単位であり、
// 拗音はひとつのKanaオブジェクトとして扱う
// また、「っ」と「ん」はそれぞれひとつのKanaオブジェクトとして扱う
class Kana {

  // Kanaオブジェクトごとに、生成するstateに固有の番号を割り当てる
  // 256の倍数を採番の開始値とし、ひとつのKanaオブジェクトが256個の番号を利用可能とする
  static nextStateNumOrigin() {
    if (!this._stateNumOrigin) {
      this._stateNumOrigin = 1;
    }
    return 256 * this._stateNumOrigin++;
  }

  constructor(seq) {
    this.seq = seq;
    this.stateNumOrigin = Kana.nextStateNumOrigin();
    this.stateNum = this.stateNumOrigin;
  }

  newState() {
    return new KanaState(this.nextStateNum());
  }

  nextStateNum() {
    return this.stateNum++;
  }

  getDefaultRoman() {
    throw "unsupported operation";
  }

  getDefaultRomanAfterThis() {
    return this.seq.getDefaultRomanAfter(this);
  }

  getDFAPart() {
    throw "getDFAPart() must be implemented by subclasses.";
  }
}

Kana.Single = class extends Kana {

  constructor(seq, ch) {
    super(seq);
    this.ch = ch;
    this.romans = Kana.mapping[ch];
  }

  getDefaultRoman() {
    return this.romans[0];
  }

  getDFAPart() {
    const parts = this.romans.map(roman => {
      const states = roman.split("").reduce((states, ch) => {
        const prevState = states[states.length - 1];
        const nextState = this.newState();
        prevState.edges.push(new dfa.Edge(new dfa.CharLabel.Single(ch), nextState.num));
        return states.concat(nextState)
      }, [ this.newState() ]);
      const first = states.shift();
      return new DFAPart(first.edges, states);
    });
    return DFAPart.mergeAll(parts);
  }
}

Kana.Double = class extends Kana {
  constructor(seq, chs) {
    super(seq);
    this.chs = chs;
    this.romans = Kana.mapping[chs];
  }
  getDefaultRoman() {
    return this.romans[0];
  }
}

Kana.Ltu = class extends Kana {

  constructor(seq, prev) {
    super(seq);
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
}

Kana.Nn = class extends Kana {
  
  constructor(seq, prev) {
    super(seq);
    this.prev = prev;
    this.allowSingleN = prev && !"aiueony".includes(prev.getDefaultRoman().charAt(0));
  }

  // 「ん」は、後ろにカナが続き、かつそれがア行でもナ行でもヤ行でもない場合、nひとつでも許される
  // そうでない場合はnnと重ねる必要がある
  getDefaultRoman() {
    return this.allowSingleN ? "n" : "nn";
  }
}

// http://gontyping.com/input-method/maniac.html を参考に
// Google日本語入力で変換できないものは除外した
Kana.DEFAULT_KANA_MAPPING = {
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
};
Kana.mapping = JSON.parse(JSON.stringify(Kana.DEFAULT_KANA_MAPPING));


module.exports = {
  KanaSequence: KanaSequence,
  Kana: Kana
};
