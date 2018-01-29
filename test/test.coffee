chai = require 'chai'
should = require 'should'
typing = require '../src/typing-ja.js'
am = require 'dfa.js'

assert = chai.assert
Sentence = typing.Sentence
Kana = typing.Kana
CharInput = am.CharInput
seq = am.StateNumSequence.newSequence()

describe 'Sentence', ->
  describe 'constructor(text)', ->
    it 'should generate a correct kana array', (done)->
      sentence = new Sentence 'ニャットナクニャンコ'
      assert.strictEqual sentence.kanas.length, 8
      assert.strictEqual sentence.kanas[0].constructor.name, 'Kana_Double'
      assert.strictEqual sentence.kanas[1].constructor.name, 'Kana_Ltu'
      assert.strictEqual sentence.kanas[2].constructor.name, 'Kana_Single'
      assert.strictEqual sentence.kanas[3].constructor.name, 'Kana_Single'
      assert.strictEqual sentence.kanas[4].constructor.name, 'Kana_Single'
      assert.strictEqual sentence.kanas[5].constructor.name, 'Kana_Double'
      assert.strictEqual sentence.kanas[6].constructor.name, 'Kana_N'
      assert.strictEqual sentence.kanas[7].constructor.name, 'Kana_Single'
      assert.strictEqual sentence.kanas[0].getDefaultRoman(), 'nya'
      assert.strictEqual sentence.kanas[1].getDefaultRoman(), 't'
      assert.strictEqual sentence.kanas[2].getDefaultRoman(), 'to'
      assert.strictEqual sentence.kanas[3].getDefaultRoman(), 'na'
      assert.strictEqual sentence.kanas[4].getDefaultRoman(), 'ku'
      assert.strictEqual sentence.kanas[5].getDefaultRoman(), 'nya'
      assert.strictEqual sentence.kanas[6].getDefaultRoman(), 'n'
      assert.strictEqual sentence.kanas[7].getDefaultRoman(), 'ko'
      done()
    it 'should normalize Hirakana to Katakana', (done)->
      sentence = new Sentence 'ニャッとなくニャンコ'
      assert.strictEqual sentence.text, 'ニャッとなくニャンコ'
      assert.strictEqual sentence.kanas.length, 8
      assert.strictEqual sentence.kanas[0].getDefaultRoman(), 'nya'
      assert.strictEqual sentence.kanas[1].getDefaultRoman(), 't'
      assert.strictEqual sentence.kanas[2].getDefaultRoman(), 'to'
      assert.strictEqual sentence.kanas[3].getDefaultRoman(), 'na'
      assert.strictEqual sentence.kanas[4].getDefaultRoman(), 'ku'
      assert.strictEqual sentence.kanas[5].getDefaultRoman(), 'nya'
      assert.strictEqual sentence.kanas[6].getDefaultRoman(), 'n'
      assert.strictEqual sentence.kanas[7].getDefaultRoman(), 'ko'
      done()
  describe 'getDFA()', ->
    it 'should xxx', (done)->
      sentence = new Sentence 'ニャンコ'
      dfa = sentence.getDFA()
      trans = dfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'k'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'o'
      assert.isTrue trans.isAcceptable()
      trans = dfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'i'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'c'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'o'
      assert.isTrue trans.isAcceptable()
      done()

describe 'Challenge', ->
  sentence = new Sentence 'ニャンコ'
  challenge = sentence.newChallenge()
  describe 'constructor(sentence)', ->
    it 'should has proper initial properties', (done)->
      assert.isFalse challenge.isCleared()
      assert.strictEqual challenge.typedRoman, ''
      assert.strictEqual challenge.remainingRoman, 'nyanko'
      assert.strictEqual challenge.typingCount, 0
      assert.strictEqual challenge.mistypingCount, 0
      done()
  describe 'input(key)', ->
    it 'should accept a correct key input', (done)->
      assert.isTrue challenge.input 'n'
      done()
    it 'should store typedRoman when a correct key is input', (done)->
      assert.strictEqual challenge.typedRoman, 'n'
      done()
    it 'should prune remainingRoman when a correct key is input', (done)->
      assert.strictEqual challenge.remainingRoman, 'yanko'
      done()
    it 'should increment typingCount when a correct key is input', (done)->
      assert.strictEqual challenge.typingCount, 1
      done()
    it 'should not increment mistypingCount when a correct key is input', (done)->
      assert.strictEqual challenge.mistypingCount, 0
      done()
    it 'should not be cleared when it needs more input', (done)->
      assert.isFalse challenge.isCleared()
      done()
    it 'should not accept a wrong key input', (done)->
      assert.isFalse challenge.input 'a'
      done()
    it 'should not store typedRoman when a wrong key is input', (done)->
      assert.strictEqual challenge.typedRoman, 'n'
      done()
    it 'should not prune remainingRoman when a wrong key is input', (done)->
      assert.strictEqual challenge.remainingRoman, 'yanko'
      done()
    it 'should not increment typingCount when a wrong key is input', (done)->
      assert.strictEqual challenge.typingCount, 1
      done()
    it 'should increment mistypingCount when a wrong key is input', (done)->
      assert.strictEqual challenge.mistypingCount, 1
      done()
    it 'should be cleared with correct input sequence', (done)->
      assert.isTrue challenge.input 'y'
      assert.strictEqual challenge.typedRoman, 'ny'
      assert.strictEqual challenge.remainingRoman, 'anko'
      assert.isTrue challenge.input 'a'
      assert.strictEqual challenge.typedRoman, 'nya'
      assert.strictEqual challenge.remainingRoman, 'nko'
      assert.isTrue challenge.input 'n'
      assert.strictEqual challenge.typedRoman, 'nyan'
      assert.strictEqual challenge.remainingRoman, 'ko'
      assert.isTrue challenge.input 'k'
      assert.strictEqual challenge.typedRoman, 'nyank'
      assert.strictEqual challenge.remainingRoman, 'o'
      assert.isFalse challenge.isCleared()
      assert.isTrue challenge.input 'o'
      assert.strictEqual challenge.typedRoman, 'nyanko'
      assert.strictEqual challenge.remainingRoman, ''
      assert.isTrue challenge.isCleared()
      done()
    it 'should make remainingRoman change in response to alternative inputs', (done)->
      challenge = sentence.newChallenge()
      assert.isTrue challenge.input 'n'
      assert.isTrue challenge.input 'i'
      assert.strictEqual challenge.typedRoman, 'ni'
      assert.strictEqual challenge.remainingRoman, 'lyanko'
      assert.isTrue challenge.input 'x'
      assert.strictEqual challenge.typedRoman, 'nix'
      assert.strictEqual challenge.remainingRoman, 'yanko'
      assert.isTrue challenge.input 'y'
      assert.isTrue challenge.input 'a'
      assert.strictEqual challenge.typedRoman, 'nixya'
      assert.strictEqual challenge.remainingRoman, 'nko'
      assert.isTrue challenge.input 'n'
      assert.isTrue challenge.input 'n'
      assert.strictEqual challenge.typedRoman, 'nixyann'
      assert.strictEqual challenge.remainingRoman, 'ko'
      done()


describe 'Kana.Single', ->
  sentence = new Sentence 'ウホィ'
  u = sentence.kanas[0]
  ho = sentence.kanas[1]
  li = sentence.kanas[2]
  describe 'static tails(roman)', ->
    it 'should return an array of tails like: ["hoge", "oge", "ge", "e"] for string "hoge"', (done)->
      conts = Kana.tails 'hoge'
      assert.strictEqual conts.length, 4
      assert.strictEqual conts[0], 'hoge'
      assert.strictEqual conts[1], 'oge'
      assert.strictEqual conts[2], 'ge'
      assert.strictEqual conts[3], 'e'
      done()
  describe 'static romanToFragment(roman)', ->
    it 'should return a fragment that accepts the roman', (done)->
      frag = Kana.romanToFragment 'nya'
      states = frag.states
      assert.strictEqual states[0].attrs['tail'], 'nya'
      assert.strictEqual states[1].attrs['tail'], 'ya'
      assert.strictEqual states[2].attrs['tail'], 'a'
      assert.isTrue states[3].isAcceptable()
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment frag, nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      done()
  describe 'getDefaultRoman()', ->
    it 'should ', (done)->
      assert.strictEqual u.getDefaultRoman(), 'u'
      assert.strictEqual ho.getDefaultRoman(), 'ho'
      assert.strictEqual li.getDefaultRoman(), 'li'
      done()
  describe 'romans', ->
    it 'should be all of romans that can input the character', (done)->
      assert.strictEqual u.romans.length, 3
      assert.strictEqual ho.romans.length, 1
      assert.strictEqual li.romans.length, 4
      assert.strictEqual u.romans[0], 'u'
      assert.strictEqual u.romans[1], 'wu'
      assert.strictEqual u.romans[2], 'whu'
      done()
  describe 'getNFAFragment()', ->
    it 'should generate a fragement which can accept the inputs corresponding each romans', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment u.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'w'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'w'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'h'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      done()

describe 'Kana.Double', ->
  sentence = new Sentence 'シャチョサン'
  sya = sentence.kanas[0]
  cyo = sentence.kanas[1]
  describe 'getNFAFragment()', ->
    it 'should generate a fragement which can accept the inputs corresponding each romans', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment sya.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'h'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'i'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'i'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'h'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'i'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'y'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'a'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isFalse trans.move new CharInput 'h'
      assert.isFalse trans.move new CharInput 'y'
      assert.isFalse trans.move new CharInput 'a'
      assert.isFalse trans.move new CharInput 'i'
      assert.isFalse trans.move new CharInput 'l'
      assert.isFalse trans.move new CharInput 'x'
      done()


describe 'Kana.Ltu', ->
  sentence = new Sentence 'アッ'
  ltu1 = sentence.kanas[1]
  sentence = new Sentence 'アッアッ'
  ltu2 = sentence.kanas[1]
  sentence = new Sentence 'モップ'
  ltu3 = sentence.kanas[1]
  describe 'getNFAFragment() for ッ without trailing letters', ->
    it 'should generate a fragement which accepts "ltu","xtu","ltsu","xtsu"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment ltu1.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      done()
  describe 'getNFAFragment() for ッ with trailing letter "a"', ->
    it 'should generate a fragement which accepts "ltu","xtu","ltsu","xtsu"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment ltu2.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isFalse trans.move new CharInput 'a'
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      done()
  describe 'getNFAFragment() for ッ with trailing letter "p"', ->
    it 'should generate a fragement which accepts "p","ltu","xtu","ltsu","xtsu"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment ltu3.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'p'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'l'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'x'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 't'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 's'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'u'
      assert.isTrue trans.isAcceptable()
      done()


describe 'Kana.N', ->
  sentence = new Sentence 'ピョン'
  n1 = sentence.kanas[1]
  sentence = new Sentence 'フンヌー'
  n2 = sentence.kanas[1]
  sentence = new Sentence 'ンン'
  n3 = sentence.kanas[0]
  sentence = new Sentence 'ンアッー'
  n4 = sentence.kanas[0]
  sentence = new Sentence 'フンガー'
  n5 = sentence.kanas[1]
  describe 'getNFAFragment() for ッ without trailing letters', ->
    it 'should generate a fragement which just accepts "nn"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment n1.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      done()
  describe 'getNFAFragment() for ッ with trailing "aiueony"', ->
    it 'should generate a fragement which just accepts "nn"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment n2.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment n3.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment n4.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isFalse trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      done()
  describe 'getNFAFragment() for ッ with trailing none-"n"', ->
    it 'should generate a fragement which accepts "n","nn"', (done)->
      nfa = new am.NFA()
      nfa.addStartState new am.State seq.next(), []
      nfa.appendFragment n5.getNFAFragment(), nfa.start.num
      trans = nfa.startNewTransition()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      assert.isTrue trans.move new CharInput 'n'
      assert.isTrue trans.isAcceptable()
      done()
