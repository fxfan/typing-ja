(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var typing = require("../../src/typing-ja");

var newChallenge = function () {
  var questions = ["マヨイマイマイ", "ナデコメドゥーサ", "ツバサキャット", "スルガモンキー", "コヨミヴァンプ", "シノブマスタード", "カレンオウガ", "ツキヒフェニックス", "ヒタギエンド", "デストピアデスエデュケーション"];
  return function () {
    var q = questions[Math.floor(Math.random() * questions.length)];
    return new typing.Sentence(q).newChallenge();
  };
}();

var showChallenge = function () {
  var $correct = document.getElementById("correct");
  var $mistype = document.getElementById("mistype");
  var $kana = document.getElementById("kana");
  var $roman = document.getElementById("roman");
  return function () {
    $correct.innerHTML = typingCount;
    $mistype.innerHTML = mistypingCount;
    $kana.innerHTML = challenge.text;
    $roman.innerHTML = "<span class=\"typed\">" + challenge.typedRoman + "</span\"><span class=\"remaining\">" + challenge.remainingRoman + "</span>";
  };
}();

var challenge = newChallenge();
var typingCount = 0;
var mistypingCount = 0;

showChallenge();

addEventListener("keydown", function (e) {
  challenge.input(e.key);
  if (challenge.isCleared()) {
    typingCount += challenge.typingCount;
    mistypingCount += challenge.mistypingCount;
    challenge = newChallenge();
  }
  showChallenge();
});

},{"../../src/typing-ja":3}],2:[function(require,module,exports){
"use strict";var _createClass=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}();function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperties(Array.prototype,{__dfajs_flatten:{value:function value(){return Array.prototype.concat.apply([],this)},enumerable:!1},__dfajs_uniq:{value:function value(){return this.filter(function(e,t,n){return n.indexOf(e)===t})},enumerable:!1},__dfajs_uniqAsString:{value:function value(){return this.map(function(e){return[e,e.toString()]}).filter(function(e,t,n){return n.findIndex(function(t){return t[1]===e[1]})===t}).map(function(e){return e[0]})},enumerable:!1},__dfajs_concatTo:{value:function value(e){return e.concat(this)},enumerable:!1}});var Input=function(){function Input(){_classCallCheck(this,Input)}return _createClass(Input,[{key:"val",value:function val(){throw"Input#val() must be implemented by subclasses"}}]),Input}(),CharInput=function(e){function CharInput(e){_classCallCheck(this,CharInput);var t=_possibleConstructorReturn(this,(CharInput.__proto__||Object.getPrototypeOf(CharInput)).call(this));return t.ch=e,_possibleConstructorReturn(t,Object.freeze(t))}return _inherits(CharInput,Input),_createClass(CharInput,[{key:"val",value:function val(){return this.ch}}],[{key:"create",value:function create(e){return e.split("").map(function(e){return new CharInput(e)})}}]),CharInput}(),Label=function(){function Label(){_classCallCheck(this,Label)}return _createClass(Label,[{key:"match",value:function match(e){throw"Label#match(input) must be implemented by subclasses"}},{key:"equals",value:function equals(e){throw"Label#equals(label) must be implemented by subclasses"}}]),Label}(),Epsilon=function(e){function Epsilon(){return _classCallCheck(this,Epsilon),_possibleConstructorReturn(this,(Epsilon.__proto__||Object.getPrototypeOf(Epsilon)).apply(this,arguments))}return _inherits(Epsilon,Label),_createClass(Epsilon,[{key:"match",value:function match(e){return!1}},{key:"equals",value:function equals(e){return this===e}},{key:"toString",value:function toString(){return"Label.E"}}]),Epsilon}();Label.E=new Epsilon;var CharLabel=function(e){function CharLabel(){return _classCallCheck(this,CharLabel),_possibleConstructorReturn(this,(CharLabel.__proto__||Object.getPrototypeOf(CharLabel)).apply(this,arguments))}return _inherits(CharLabel,Label),CharLabel}();CharLabel.Single=function(e){function CharLabel_Single(e){_classCallCheck(this,CharLabel_Single);var t=_possibleConstructorReturn(this,(CharLabel_Single.__proto__||Object.getPrototypeOf(CharLabel_Single)).call(this));return t.ch=e,_possibleConstructorReturn(t,Object.freeze(t))}return _inherits(CharLabel_Single,CharLabel),_createClass(CharLabel_Single,[{key:"match",value:function match(e){return e.val()===this.ch}},{key:"equals",value:function equals(e){return this.constructor.name===e.constructor.name&&this.ch===e.ch}},{key:"toString",value:function toString(){return"CharLabel.Single[ch="+this.ch+"]"}}]),CharLabel_Single}(),CharLabel.Range=function(e){function CharLabel_Range(e,t){_classCallCheck(this,CharLabel_Range);var n=_possibleConstructorReturn(this,(CharLabel_Range.__proto__||Object.getPrototypeOf(CharLabel_Range)).call(this));return n.first=e,n.end=t,_possibleConstructorReturn(n,Object.freeze(n))}return _inherits(CharLabel_Range,CharLabel),_createClass(CharLabel_Range,[{key:"match",value:function match(e){return e.val()>=this.first&&e.val()<=this.end}},{key:"equals",value:function equals(e){return this.constructor.name===e.constructor.name&&this.first===e.first&&this.end===e.end}},{key:"toString",value:function toString(){return"CharLabel.Range[first="+this.first+",end="+this.end+"]"}}]),CharLabel_Range}(),CharLabel.Include=function(e){function CharLabel_Include(e){_classCallCheck(this,CharLabel_Include);var t=_possibleConstructorReturn(this,(CharLabel_Include.__proto__||Object.getPrototypeOf(CharLabel_Include)).call(this));return t.chars=e,_possibleConstructorReturn(t,Object.freeze(t))}return _inherits(CharLabel_Include,CharLabel),_createClass(CharLabel_Include,[{key:"match",value:function match(e){return this.chars.includes(e.val())}},{key:"equals",value:function equals(e){return this.constructor.name===e.constructor.name&&this.chars===e.chars}},{key:"toString",value:function toString(){return"CharLabel.Include[chars="+this.chars+"]"}}]),CharLabel_Include}(),CharLabel.Exclude=function(e){function CharLabel_Exclude(e){_classCallCheck(this,CharLabel_Exclude);var t=_possibleConstructorReturn(this,(CharLabel_Exclude.__proto__||Object.getPrototypeOf(CharLabel_Exclude)).call(this));return t.chars=e,_possibleConstructorReturn(t,Object.freeze(t))}return _inherits(CharLabel_Exclude,CharLabel),_createClass(CharLabel_Exclude,[{key:"match",value:function match(e){return!this.chars.includes(e.val())}},{key:"equals",value:function equals(e){return this.constructor.name===e.constructor.name&&this.chars===e.chars}},{key:"toString",value:function toString(){return"CharLabel.Exclude[chars="+this.chars+"]"}}]),CharLabel_Exclude}(),CharLabel.Or=function(e){function CharLabel_Or(){_classCallCheck(this,CharLabel_Or);var e=_possibleConstructorReturn(this,(CharLabel_Or.__proto__||Object.getPrototypeOf(CharLabel_Or)).call(this));return e.labels=Object.freeze(Array.prototype.slice.call(arguments).sort()),_possibleConstructorReturn(e,Object.freeze(e))}return _inherits(CharLabel_Or,CharLabel),_createClass(CharLabel_Or,[{key:"match",value:function match(e){return this.labels.some(function(t){return t.match(e)})}},{key:"equals",value:function equals(e){if(this.constructor.name!==e.constructor.name)return!1;if(this.labels.length!==e.labels.length)return!1;for(var t=0;t<this.labels;t++)if(!this.labels[t].match(e.labels[t]))return!1;return!0}},{key:"toString",value:function toString(){return"CharLabel.Or[labels="+this.labels.join(",")+"]"}}]),CharLabel_Or}();var Edge=function(){function Edge(e,t){return _classCallCheck(this,Edge),this.label=e,this.dest=t,Object.freeze(this)}return _createClass(Edge,[{key:"hasSameLabelWith",value:function hasSameLabelWith(e){return this.label.equals(e.label)}},{key:"tryTransition",value:function tryTransition(e,t){return this.label.match(e,t)?this.dest:null}},{key:"changeDest",value:function changeDest(e){return new Edge(this.label,e)}},{key:"toString",value:function toString(){return"Edge(label="+this.label+", dest="+this.dest+")"}}]),Edge}(),State=function(){function State(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;return _classCallCheck(this,State),this.num=e,this.edges=Object.freeze(t?t.slice():[]),this.attrs=Object.freeze(n?Object.assign({},n):{}),this.acceptable=!!r,this.obj=void 0===a?null:Object.freeze(a),Object.freeze(this)}return _createClass(State,[{key:"hasEpsilonMove",value:function hasEpsilonMove(){return this.edges.some(function(e){return e.label.equals(Label.E)})}},{key:"hasDuplicateEdge",value:function hasDuplicateEdge(){var e=new Set;return this.edges.forEach(function(t){return e.add(t.label.toString())}),e.size<this.edges.length}},{key:"getAcceptedObject",value:function getAcceptedObject(){return this.obj}},{key:"isAcceptable",value:function isAcceptable(){return this.acceptable}},{key:"isEdgeExists",value:function isEdgeExists(){return this.edges.length>0}},{key:"toAcceptable",value:function toAcceptable(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return new State(this.num,this.edges,this.attrs,!0,e)}},{key:"toUnacceptable",value:function toUnacceptable(){return new State(this.num,this.edges,this.attrs,!1,null)}},{key:"addEdges",value:function addEdges(e){return new State(this.num,this.edges.concat(e),this.attrs,this.acceptable,this.obj)}},{key:"changeEdgesDest",value:function changeEdgesDest(e,t){if(this.edges.some(function(t){return t.dest===e})){var n=this.edges.map(function(n){return n.dest===e?n.changeDest(t):n});return new State(this.num,n,this.attrs,this.acceptable,this.obj)}return this}},{key:"toString",value:function toString(){return"State(num="+this.num+", edges="+this.edges+", attrs="+this.attrs+", acceptable="+this.acceptable+", obj="+this.obj+")"}}]),State}(),StateNumSequence=function(){function StateNumSequence(e){_classCallCheck(this,StateNumSequence),this._origin=e,this._next=e}return _createClass(StateNumSequence,null,[{key:"newSequence",value:function newSequence(){return void 0===this._seed&&(this._seed=0),new StateNumSequence(65536*++this._seed)}}]),_createClass(StateNumSequence,[{key:"next",value:function next(){return this._checkRange(),this._next++}},{key:"peek",value:function peek(){return this._checkRange(),this._next}},{key:"_checkRange",value:function _checkRange(){if(this._next>this._origin+65535)throw"A sequence can only generate 65536 nums: "+this._origin+" ~ "+(this._origin+65535)}}]),StateNumSequence}(),Fragment=function(){function Fragment(e){if(_classCallCheck(this,Fragment),!Array.isArray(e)||0===e.length)throw"Parameter 'states' must be a non-empty array";return this.states=Object.freeze(e.slice()),Object.freeze(this)}return _createClass(Fragment,[{key:"toUnacceptable",value:function toUnacceptable(){return new Fragment(this.states.map(function(e){return e.toUnacceptable()}))}},{key:"toLastAcceptable",value:function toLastAcceptable(){return new Fragment(this.init.concat(this.last.toAcceptable()))}},{key:"concat",value:function concat(e){return new Fragment(this.init.concat(this.last.addEdges(e.headEdges)).concat(e.tail))}},{key:"merge",value:function merge(e){return Fragment.mergeAll([this,e])}},{key:"head",get:function get(){return this.states[0]}},{key:"tail",get:function get(){return this.states.slice(1)}},{key:"init",get:function get(){return this.states.slice(0,-1)}},{key:"last",get:function get(){return this.states[this.states.length-1]}},{key:"headEdges",get:function get(){return this.states[0].edges}}],[{key:"concatAll",value:function concatAll(e){var t=(e=e.slice()).shift();return e.reduce(function(e,t){return e.concat(t)},t)}},{key:"mergeAll",value:function mergeAll(e){var t=StateNumSequence.newSequence(),n=new State(t.next(),e.map(function(e){return new Edge(Label.E,e.head.num)})),r=new State(t.next(),[]);return new Fragment([n].concat(e.map(function(e){return e.init.concat(e.last.addEdges([new Edge(Label.E,r.num)]))})).concat(r).__dfajs_flatten())}}]),Fragment}(),DTransRecord=function(){function DTransRecord(e,t,n){return _classCallCheck(this,DTransRecord),this.num=e,this.states=Object.freeze(t.slice().sort(function(e,t){return e.num-t.num})),this.edges=Object.freeze(n.slice()),Object.freeze(this)}return _createClass(DTransRecord,[{key:"getKey",value:function getKey(){return DTransRecord.createKey(this.states)}},{key:"addEdge",value:function addEdge(e){return new DTransRecord(this.num,this.states,this.edges.concat(e))}}],[{key:"createKey",value:function createKey(e){return e.map(function(e){return e.num}).sort().toString()}}]),DTransRecord}(),NFA=function(){function NFA(){_classCallCheck(this,NFA),this.start=null,this.states={}}return _createClass(NFA,[{key:"addStartState",value:function addStartState(e){this.addState(e),this.start=e}},{key:"addState",value:function addState(e){this.states[e.num]=e}},{key:"getStateByNum",value:function getStateByNum(e,t){var n=this.states[e];if(void 0===n){if(t)throw t;return null}return n}},{key:"appendFragment",value:function appendFragment(e,t){var n=this,r=this.getStateByNum(t),a=r.addEdges([new Edge(Label.E,e.head.num)]);this.addState(a),this.start===r&&(this.start=a),e.states.forEach(function(e){return n.addState(e)})}},{key:"startNewTransition",value:function startNewTransition(){if(null===this.start)throw"Start state isn't set";return new NFATransition(this)}},{key:"getAllLabels",value:function getAllLabels(){var e=this;return Object.keys(this.states).map(function(t){return e.states[t].edges.map(function(e){return e.label}).filter(function(e){return e!==Label.E})}).__dfajs_flatten().__dfajs_uniqAsString()}},{key:"eClosure",value:function eClosure(e){var t=this;return Object.keys(e).map(function(n){return function _eclosure(e){return e.edges.filter(function(e){return e.label===Label.E}).map(function(n){return _eclosure(t.getStateByNum(n.dest,"State "+n.dest+"(linked from "+e.num+") not found"))}).__dfajs_flatten().__dfajs_concatTo([e])}(e[n])}).__dfajs_flatten().__dfajs_uniq()}},{key:"move",value:function move(e,t){var n=this;return e.reduce(function(e,r){return r.edges.filter(function(e){return e.label.equals(t)}).map(function(e){return n.getStateByNum(e.dest,"State "+e.dest+"(linked from "+r.num+") not found")}).__dfajs_concatTo(e)},[]).__dfajs_uniq()}},{key:"toDFA",value:function toDFA(){var e=this,t=StateNumSequence.newSequence(),n=this.getAllLabels(),r=this.eClosure([this.start]),a=new DTransRecord(t.next(),r,[]),s=a.getKey(),i=function _createTable(r,a){return n.reduce(function(n,a){var s=DTransRecord.createKey(r),i=e.eClosure(e.move(r,a));if(0===i.length)return n;var u=DTransRecord.createKey(i);if(n[u]){var c=new Edge(a,n[u].num);return Object.assign({},n,_defineProperty({},s,n[s].addEdge(c)))}var l,o=new DTransRecord(t.next(),i,[]),h=new Edge(a,o.num);return n=Object.assign({},n,(_defineProperty(l={},s,n[s].addEdge(h)),_defineProperty(l,u,o),l)),_createTable(i,n)},a)}(r,_defineProperty({},s,a));return Object.keys(i).reduce(function(e,t){var n=i[t],r=n.states.reduce(function(e,t){return Object.keys(t.attrs).reduce(function(e,n){var r=void 0===e[n]?[t.attrs[n]]:e[n].concat(t.attrs[n]);return Object.assign({},e,_defineProperty({},n,Object.freeze(r)))},e)},{}),a=n.states.some(function(e){return e.isAcceptable()}),u=n.states.filter(function(e){return e.isAcceptable()}).map(function(e){return e.getAcceptedObject()}),c=new State(n.num,n.edges,r,a,u.length>0?u[0]:null);return t===s?e.addStartState(c):e.addState(c),e},new DFA)}}]),NFA}(),NFATransition=function(){function NFATransition(e){_classCallCheck(this,NFATransition),this.nfa=e,this.currents=e.eClosure([e.start])}return _createClass(NFATransition,[{key:"move",value:function move(e){var t=this;return this.currents=this.nfa.eClosure(this.currents.reduce(function(n,r){return r.edges.map(function(t){return t.tryTransition(e)}).filter(function(e){return null!==e}).map(function(e){return t.nfa.getStateByNum(e,"State "+e+"(linked from "+r.num+") not found")}).__dfajs_concatTo(n)},[]).__dfajs_uniq()),0!==this.currents.length}},{key:"isAcceptable",value:function isAcceptable(){return this.currents.some(function(e){return e.isAcceptable()})}},{key:"isEdgeExists",value:function isEdgeExists(){return this.currents.some(function(e){return e.isEdgeExists()})}},{key:"getAcceptedObjects",value:function getAcceptedObjects(){var e=this.currents.filter(function(e){return e.isAcceptable()}).map(function(e){return e.getAcceptedObject()});if(0===e.length)throw"current state is not acceptable";return e}},{key:"getAcceptedObject",value:function getAcceptedObject(){return this.getAcceptedObjects()[0]}},{key:"getCurrents",value:function getCurrents(){return this.currents.slice()}}]),NFATransition}(),DFA=function(){function DFA(){_classCallCheck(this,DFA),this.start=null,this.states={}}return _createClass(DFA,[{key:"addStartState",value:function addStartState(e){this.addState(e),this.start=e}},{key:"addState",value:function addState(e){if(e.hasEpsilonMove())throw"The state has e-move";if(e.hasDuplicateEdge())throw"The state has duplicate edge";this.states[e.num]=e}},{key:"getStateByNum",value:function getStateByNum(e){return void 0===this.states[e]?null:this.states[e]}},{key:"appendFragment",value:function appendFragment(e,t){var n=this,r=this.getStateByNum(t),a=r.addEdges(e.headEdges);this.addState(a),this.start===r&&(this.start=a),e.tail.forEach(function(e){return n.addState(e)})}},{key:"startNewTransition",value:function startNewTransition(){if(null===this.start)throw"Start state isn't set";return new DFATransition(this)}}]),DFA}(),DFATransition=function(){function DFATransition(e){_classCallCheck(this,DFATransition),this.dfa=e,this.current=e.start,this.session={}}return _createClass(DFATransition,[{key:"move",value:function move(e){var t=this;if(null===this.current)throw"This transition has already failed due to illegal structure of the dfa";var n=this.current.edges.map(function(n){return n.tryTransition(e,t.session)}).find(function(e){return null!==e});if(!n)return!1;if(this.current=this.dfa.states[n],!this.current)throw"Destination state '"+n+"' is not found";return!0}},{key:"isAcceptable",value:function isAcceptable(){return this.current.isAcceptable()}},{key:"isEdgeExists",value:function isEdgeExists(){return this.current.isEdgeExists()}},{key:"getAcceptedObject",value:function getAcceptedObject(){if(!this.isAcceptable())throw"current state is not acceptable";return this.current.getAcceptedObject()}}]),DFATransition}(),CharInputSequence=function(){function CharInputSequence(e){_classCallCheck(this,CharInputSequence),this.str=e,this.nextLexis="",this.forwardingPointer=0,this.enableUnget=!1}return _createClass(CharInputSequence,[{key:"get",value:function get(){if(!this.hasNext())return null;var e=this.str.charAt(this.forwardingPointer++);return this.enableUnget=!0,this.nextLexis+=e,new CharInput(e)}},{key:"unget",value:function unget(){if(!this.enableUnget)throw"Call get before unget";this.enableUnget=!1,this.forwardingPointer--,this.nextLexis=this.nextLexis.slice(0,-1)}},{key:"findLexis",value:function findLexis(){this.enableUnget=!1;var e=this.nextLexis;return this.nextLexis="",e}},{key:"hasNext",value:function hasNext(){return this.forwardingPointer<this.str.length}}]),CharInputSequence}(),Token=function Token(e,t){_classCallCheck(this,Token),this.lexis=e,this.obj=t},Parser=function(){function Parser(e,t){_classCallCheck(this,Parser),this.dfa=e,this.input=t,this._next=null}return _createClass(Parser,[{key:"next",value:function next(){if(this.hasNext()){var e=this._next;return this._next=null,e}return null}},{key:"hasNext",value:function hasNext(){if(null!==this._next)return!0;if(!this.input.hasNext())return!1;for(var e=this.dfa.startNewTransition(),t=void 0;null!==(t=this.input.get());)if(!e.move(t)){if(e.isAcceptable()){this.input.unget();var n=this.input.findLexis();return this._next=new Token(n,e.getAcceptedObject()),!0}throw"Parse error. near '"+this.input.findLexis()+"'"}var r=this.input.findLexis();if(!e.isAcceptable())throw"Parse error. near '"+r+"'";return this._next=new Token(r,e.getAcceptedObject()),!0}}]),Parser}(),Regex=function(){function Regex(e){_classCallCheck(this,Regex),this.expr=e}return _createClass(Regex,[{key:"toFragment",value:function toFragment(){var e=StateNumSequence.newSequence(),t=new State(e.next(),[]).toAcceptable(this.expr),n=this.expr.split("").reduce(function(t,n){var r=t[t.length-1],a=new State(e.next(),[]),s=new Edge(new CharLabel.Single(n),a.num);return t[t.length-1]=r.addEdges([s]),t.concat(a)},[new State(e.next(),[])]);return new Fragment(n.slice(0,-1).concat(n[n.length-1].addEdges(new Edge(Label.E,t.num))).concat(t))}}]),Regex}();module.exports={Input:Input,CharInput:CharInput,Label:Label,CharLabel:CharLabel,Edge:Edge,State:State,StateNumSequence:StateNumSequence,Fragment:Fragment,NFA:NFA,DFA:DFA,CharInputSequence:CharInputSequence,Token:Token,Parser:Parser,Regex:Regex};
},{}],3:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var am = require("dfa.js");

var StateNumSequence = am.StateNumSequence;
var State = am.State;
var Fragment = am.Fragment;
var NFA = am.NFA;
var CharInput = am.CharInput;

var Sentence = function () {
  function Sentence(text) {
    var _this = this;

    _classCallCheck(this, Sentence);

    if (text === null || text === undefined) {
      throw "Parameter 'text' is required";
    }

    this.text = text;

    // カタカナのシーケンスとひとつ前（つまり並び順でいうとひとつ後ろ）に取得したKanaオブジェクトを渡し、
    // カタカナシーケンスから次のKanaオブジェクトと、その残りの部分を返す
    var tailKana = function tailKana(text, prevKana) {
      if (text.length > 1) {
        var chs = text.slice(-2);
        if (Kana.mapping[chs]) {
          return [new Kana.Double(_this, chs), text.slice(0, -2)];
        }
      }
      var ch = text.slice(-1);
      var remain = text.slice(0, -1);
      switch (ch) {
        case "ッ":
          return [new Kana.Ltu(_this, prevKana), remain];
        case "ン":
          return [new Kana.N(_this, prevKana), remain];
        default:
          return [new Kana.Single(_this, ch), remain];
      }
    };

    var toKanaArray = function toKanaArray(text) {
      var prevKana = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      switch (text.length) {
        case 0:
          return [];
        default:
          var _tailKana = tailKana(text, prevKana),
              _tailKana2 = _slicedToArray(_tailKana, 2),
              kana = _tailKana2[0],
              remain = _tailKana2[1];

          return toKanaArray(remain, kana).concat(kana);
      }
    };

    this.kanas = Object.freeze(toKanaArray(text));
    return Object.freeze(this);
  }

  _createClass(Sentence, [{
    key: "newChallenge",
    value: function newChallenge() {
      return new Challenge(this);
    }
  }, {
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      return this.kanas.reduce(function (s, kana) {
        return s + kana.getDefaultRoman();
      }, "");
    }

    // 指定したカナより後ろ（指定したカナを含まない）のカナ全てのデフォルトローマ字をつなげて返す。

  }, {
    key: "getDefaultRomanAfter",
    value: function getDefaultRomanAfter(kana) {
      return this.kanas.slice(this.kanas.indexOf(kana) + 1).reduce(function (s, kana) {
        return s + kana.getDefaultRoman();
      }, "");
    }
  }, {
    key: "getKanaIterator",
    value: function getKanaIterator() {
      return new KanaIterator(this);
    }
  }, {
    key: "getDFA",
    value: function getDFA() {
      var frag = Fragment.concatAll(this.kanas.map(function (kana) {
        return kana.getNFAFragment();
      })).toUnacceptable().toLastAcceptable();
      var nfa = new NFA();
      nfa.addStartState(new State(StateNumSequence.newSequence().next(), []));
      nfa.appendFragment(frag, nfa.start.num);
      return nfa.toDFA();
    }
  }]);

  return Sentence;
}();

var KanaIterator = function () {
  function KanaIterator(sentence) {
    _classCallCheck(this, KanaIterator);

    this._sentence = sentence;
    this._index = 0;
  }

  _createClass(KanaIterator, [{
    key: "next",
    value: function next() {
      if (!this.hasNext()) {
        throw "No more kana in the sentence";
      }
      return this._sentence.kanas[this._index++];
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      return this._index < this._sentence.kanas.length;
    }
  }]);

  return KanaIterator;
}();

Sentence.test = function (s) {
  var sentence = new Sentence(s);
  return [sentence.getDefaultRoman()].concat(sentence.kanas.map(function (kana) {
    return kana.getDefaultRomanAfterThis();
  }));
};

// ひとつのカナを表す
// ただし、ここでいう「ひとつ」とはローマ字に変換する際の最小単位であり、
// 拗音はひとつのKanaオブジェクトとして扱う
// また、「っ」と「ん」はそれぞれひとつのKanaオブジェクトとして扱う

var Kana = function () {
  function Kana(sentence) {
    _classCallCheck(this, Kana);

    this.sentence = sentence;
  }

  _createClass(Kana, [{
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      throw "unsupported operation";
    }
  }, {
    key: "getDefaultRomanAfterThis",
    value: function getDefaultRomanAfterThis() {
      return this.sentence.getDefaultRomanAfter(this);
    }
  }, {
    key: "getNFAFragment",
    value: function getNFAFragment() {
      throw "getNFAFragment() must be implemented by subclasses.";
    }
  }, {
    key: "getDFA",
    value: function getDFA() {
      var nfa = new NFA();
      nfa.addStartState(new State(StateNumSequence.newSequence().next(), []));
      nfa.appendFragment(this.getNFAFragment(), nfa.start.num);
      return nfa.toDFA();
    }
  }], [{
    key: "tails",
    value: function tails(text) {
      var _tails = function _tails(text) {
        switch (text.length) {
          case 0:
            return [];
          default:
            return [text].concat(_tails(text.slice(1)));
        }
      };
      return _tails(text);
    }
  }, {
    key: "romanToFragment",
    value: function romanToFragment(roman) {

      var seq = StateNumSequence.newSequence();
      var last = new State(seq.next(), []).toAcceptable(roman);

      var states = Kana.tails(roman).reduce(function (states, tail) {
        var edge = new am.Edge(new am.CharLabel.Single(tail.charAt(0)), last.num);
        var state = new State(seq.next(), [edge], { "tail": tail });
        if (states.length > 0) {
          var prevState = states[states.length - 1];
          states[states.length - 1] = prevState.changeEdgesDest(last.num, state.num);
        }
        return states.concat(state);
      }, []);

      return new Fragment(states.concat(last));
    }
  }]);

  return Kana;
}();

Kana.Single = function (_Kana) {
  _inherits(Kana_Single, _Kana);

  function Kana_Single(sentence, ch) {
    var _ret;

    _classCallCheck(this, Kana_Single);

    var _this2 = _possibleConstructorReturn(this, (Kana_Single.__proto__ || Object.getPrototypeOf(Kana_Single)).call(this, sentence));

    _this2.ch = ch;
    _this2.romans = Object.freeze(Kana.mapping[ch]);
    return _ret = Object.freeze(_this2), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(Kana_Single, [{
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      return this.romans[0];
    }
  }, {
    key: "getNFAFragment",
    value: function getNFAFragment() {
      var frags = this.romans.map(function (roman) {
        return Kana.romanToFragment(roman);
      });
      return Fragment.mergeAll(frags);
    }
  }]);

  return Kana_Single;
}(Kana);

Kana.Double = function (_Kana2) {
  _inherits(Kana_Double, _Kana2);

  function Kana_Double(sentence, chs) {
    _classCallCheck(this, Kana_Double);

    var _this3 = _possibleConstructorReturn(this, (Kana_Double.__proto__ || Object.getPrototypeOf(Kana_Double)).call(this, sentence));

    _this3.chs = chs;
    _this3.romans = Kana.mapping[chs];
    return _this3;
  }

  _createClass(Kana_Double, [{
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      return this.romans[0];
    }
  }, {
    key: "getNFAFragment",
    value: function getNFAFragment() {
      // this.romansそれぞれについてFragmentを生成
      var frags1 = this.romans.map(function (roman) {
        return Kana.romanToFragment(roman);
      });

      // chsを2文字に分割し、
      //  1文字目のromansに対応するFragmentリストを作る
      //  そのそれぞれについて、2文字目のromansをマージしてできたFragmentを連結したFragmentを生成
      var second = Fragment.mergeAll(Kana.mapping[this.chs[1]].map(function (roman) {
        return Kana.romanToFragment(roman);
      }));
      var frags2 = Kana.mapping[this.chs[0]].map(function (roman) {
        return Kana.romanToFragment(roman).concat(second);
      });

      return Fragment.mergeAll(frags1.concat(frags2)).toUnacceptable().toLastAcceptable();
    }
  }]);

  return Kana_Double;
}(Kana);

Kana.Ltu = function (_Kana3) {
  _inherits(Kana_Ltu, _Kana3);

  function Kana_Ltu(sentence, prev) {
    var _ret2;

    _classCallCheck(this, Kana_Ltu);

    var _this4 = _possibleConstructorReturn(this, (Kana_Ltu.__proto__ || Object.getPrototypeOf(Kana_Ltu)).call(this, sentence));

    _this4.prev = prev;
    _this4.romans = Object.freeze(["ltu", "xtu", "ltsu", "xtsu"]);
    return _ret2 = Object.freeze(_this4), _possibleConstructorReturn(_this4, _ret2);
  }

  // 「っ」は、後ろにカナが続き、かつそれがア行でもナ行でもない場合、後ろのカナのローマ字の子音先頭ひと文字を重ねる
  // そうでない場合は単独入力する


  _createClass(Kana_Ltu, [{
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      if (this.prev) {
        var c = this.prev.getDefaultRoman().charAt(0);
        if (!"aiueon".includes(c)) {
          return c;
        }
      }
      return this.romans[0];
    }
  }, {
    key: "getNFAFragment",
    value: function getNFAFragment() {
      var frags = [];
      if (this.prev) {
        var c = this.prev.getDefaultRoman().charAt(0);
        if (!"aiueon".includes(c)) {
          frags.push(Kana.romanToFragment(c));
        }
      }
      return Fragment.mergeAll(frags.concat(this.romans.map(function (roman) {
        return Kana.romanToFragment(roman);
      })));
    }
  }]);

  return Kana_Ltu;
}(Kana);

Kana.N = function (_Kana4) {
  _inherits(Kana_N, _Kana4);

  function Kana_N(sentence, prev) {
    var _ret3;

    _classCallCheck(this, Kana_N);

    var _this5 = _possibleConstructorReturn(this, (Kana_N.__proto__ || Object.getPrototypeOf(Kana_N)).call(this, sentence));

    _this5.prev = prev;
    _this5.allowSingleN = prev && !"aiueony".includes(prev.getDefaultRoman().charAt(0));
    return _ret3 = Object.freeze(_this5), _possibleConstructorReturn(_this5, _ret3);
  }

  // 「ん」は、後ろにカナが続き、かつそれがア行でもナ行でもヤ行でもない場合、nひとつでも許される
  // そうでない場合はnnと重ねる必要がある


  _createClass(Kana_N, [{
    key: "getDefaultRoman",
    value: function getDefaultRoman() {
      return this.allowSingleN ? "n" : "nn";
    }
  }, {
    key: "getNFAFragment",
    value: function getNFAFragment() {
      if (this.allowSingleN) {
        return Fragment.mergeAll(["n", "nn"].map(function (roman) {
          return Kana.romanToFragment(roman);
        })).toUnacceptable().toLastAcceptable();
      } else {
        return Kana.romanToFragment("nn");
      }
    }
  }]);

  return Kana_N;
}(Kana);

var Challenge = function () {
  function Challenge(sentence) {
    _classCallCheck(this, Challenge);

    this._sentence = sentence;
    this._transitions = sentence.kanas.map(function (kana) {
      return kana.getDFA().startNewTransition();
    });
    this._pointer = 0;
    this._typedRoman = [];
    this._typingCount = 0;
    this._mistypingCount = 0;
  }

  _createClass(Challenge, [{
    key: "input",
    value: function input(key) {

      if (this.isCleared()) {
        throw "Challenge has been cleared";
      }

      // 「ん」がnでもnnでも受理可能な場合、
      // nを受理した時点で「ん」のDFA遷移を終了させるわけにはいかず
      // 「ん」の次のカナについて何かの入力を受理した時点ではじめて「ん」の遷移は終了として扱える
      // 
      // pointerが指しているtransitionについて
      //  - 受理状態になってもまだpointerを進めることはしない
      //  - 入力があったらpointerが指すtransitionが遷移可能か調べ、可能ならする
      //  - transitionが受理状態かつ遷移不可である場合、pointer+1のtransitionで遷移を試みる
      //  - それが成功なら、ここでpointerを進める
      //  - 失敗なら、入力ミス
      //  - transitionが受理状態かつ次のtransitionがない(最後のtransitionが受理状態である)場合、clearとなる

      var input = new CharInput(key);

      if (this._currentTransition.move(input)) {
        this._typedRoman.push(key);
        this._typingCount++;
        return true;
      } else {
        var next = this._transitions[this._pointer + 1];
        if (this._currentTransition.isAcceptable() && next && next.move(input)) {
          this._typedRoman.push(key);
          this._typingCount++;
          this._pointer++;
          return true;
        }
        this._mistypingCount++;
        return false;
      }
    }
  }, {
    key: "isCleared",
    value: function isCleared() {
      return this._transitions[this._transitions.length - 1].isAcceptable();
    }
  }, {
    key: "text",
    get: function get() {
      return this._sentence.text;
    }
  }, {
    key: "roman",
    get: function get() {
      return this._sentence.getDefaultRoman();
    }
  }, {
    key: "typedRoman",
    get: function get() {
      return this._typedRoman.join("");
    }
  }, {
    key: "remainingRoman",
    get: function get() {
      if (this.isCleared()) {
        return "";
      }
      var tails = this._currentTransition.current.attrs["tail"];
      return (!this._currentTransition.isAcceptable() && tails && tails.length > 0 ? tails[0] : "") + this._sentence.getDefaultRomanAfter(this._currentKana);
    }
  }, {
    key: "typingCount",
    get: function get() {
      return this._typingCount;
    }
  }, {
    key: "mistypingCount",
    get: function get() {
      return this._mistypingCount;
    }
  }, {
    key: "_currentTransition",
    get: function get() {
      return this._transitions[this._pointer];
    }
  }, {
    key: "_currentKana",
    get: function get() {
      return this._sentence.kanas[this._pointer];
    }
  }]);

  return Challenge;
}();

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
  KanaIterator: KanaIterator,
  Kana: Kana,
  Challenge: Challenge
};

},{"dfa.js":2}]},{},[1]);
