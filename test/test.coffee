chai = require 'chai'
should = require 'should'
typing = require '../src/typing-ja.js'

assert = chai.assert
Sentence = typing.Sentence
Kana = typing.Kana

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

describe 'Kana.Single', ->
  sentence = new Sentence 'ウホィ'
  u = sentence.kanas[0]
  ho = sentence.kanas[1]
  li = sentence.kanas[2]
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
