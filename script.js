
const screens={home:document.getElementById("home"),instructions:document.getElementById("instructions"),play:document.getElementById("play"),result:document.getElementById("result"),manage:document.getElementById("manage")}
const scoreEl=document.getElementById("score")
const livesEl=document.getElementById("lives")
const timerEl=document.getElementById("timer")
const questionEl=document.getElementById("question")
const choicesEl=document.getElementById("choices")
const explainEl=document.getElementById("explain")
const finalScoreEl=document.getElementById("final-score")
const accuracyEl=document.getElementById("accuracy")
const reviewEl=document.getElementById("review")
const qnumEl=document.getElementById("qnum")
const qtotalEl=document.getElementById("qtotal")
const progressBar=document.getElementById("progress-bar")
const startBtn=document.getElementById("start-btn")
const restartBtn=document.getElementById("restart-btn")
const navBtns=[...document.querySelectorAll(".nav-btn")]
const difficultyBtns=[...document.querySelectorAll('.seg-btn')]
const helpBtn=document.getElementById('help-btn')
const pauseBtn=document.getElementById('pause-btn')
const tutorial=document.getElementById('tutorial')
const closeTutorial=document.getElementById('close-tutorial')
const closeInstructionsBtn = document.getElementById('close-instructions')
const closeManageBtn = document.getElementById('close-manage')
const form=document.getElementById("question-form")
const qText=document.getElementById("q-text")
const c0=document.getElementById("c0")
const c1=document.getElementById("c1")
const c2=document.getElementById("c2")
const c3=document.getElementById("c3")
const answerIndexSel=document.getElementById("answer-index")
const diffSel=document.getElementById("diff-select")
const questionList=document.getElementById("question-list")
const resetDefaultsBtn=document.getElementById("reset-defaults")
const clearAllBtn=document.getElementById("clear-all")
const combatEl=document.getElementById('combat')
const ninjaEl=document.getElementById('ninja')
const enemyEl=document.getElementById('enemy')
const ninjaLivesEl=document.getElementById('ninja-lives')
let questions=[]
let order=[]
let idx=0
let score=0
let lives=3
let time=15
let timer=null
let correctCount=0
let answered=0
let wrongLog=[]
let gameOver=false
let difficulty='easy'
const BASE_TIME={easy:20,normal:15,hard:12,hacker:8}
const MIN_TIME={easy:12,normal:10,hard:8,hacker:6}
let paused=false
let pausedFromOverlay=false
let streak=0
let choiceOrder=[]
let currentButtons=[]
function showSection(id){
	// if we're leaving the play screen, clear any active explosion effects
	if(screens.play && !screens.play.classList.contains('hidden') && id !== 'play'){
		const explosion = document.getElementById('bomb-explosion')
		if(explosion){
			explosion.classList.add('hidden')
			const debris = explosion.querySelector('.explosion-debris')
			if(debris) debris.innerHTML = ''
		}
		document.body.style.animation = ''
	}
	Object.values(screens).forEach(s=>s.classList.add("hidden"))
	screens[id].classList.remove("hidden")
}
function hearts(n){return "❤".repeat(Math.max(0,n))}
const DEFAULT_BANK_VERSION=2
function loadQuestions(){const raw=localStorage.getItem("module9_questions");const ver=localStorage.getItem("module9_questions_version");const defaults=[
{q:"Experiment: roll a fair die. What is the sample space?",c:["{1,2,3,4,5,6}","{H,T}","{}","{even,odd}"],a:0,d:"easy",ex:"For a fair die, S = {1,2,3,4,5,6}."},
{q:"Flip two coins. Probability of exactly one head.",c:["1/2","1/4","3/4","2/3"],a:0,d:"easy",ex:"Outcomes: {HH,HT,TH,TT}. Exactly one head: HT,TH → 2/4 = 1/2."},
{q:"If P(A) = 0.35, find P(A').",c:["0.65","0.35","0.50","1.35"],a:0,d:"easy",ex:"Complement: P(A') = 1 − P(A) = 0.65."},
{q:"Flip 3 coins. How many outcomes in the sample space?",c:["8","6","4","3"],a:0,d:"easy",ex:"Each coin has 2 outcomes → 2^3 = 8."},
{q:"If P(B) = 0.82, what is P(B^c)?",c:["0.18","0.82","0.20","0.12"],a:0,d:"easy",ex:"Complement: P(B^c)=1−0.82=0.18."},
{q:"Roll two dice. How many outcomes are possible?",c:["36","12","18","6"],a:0,d:"easy",ex:"Outcomes are ordered pairs (1–6,1–6) ⇒ 6×6=36."},
{q:"Fair die: probability of an even number.",c:["1/2","1/3","2/3","3/4"],a:0,d:"easy",ex:"Evens {2,4,6} out of 6 ⇒ 3/6 = 1/2."},
{q:"Draw one card: probability of a heart.",c:["1/4","1/13","4/13","13/52"],a:0,d:"easy",ex:"Hearts are 13/52 = 1/4."},
{q:"Which is an event when rolling a die?",c:["{2,4,6}","6","{H,T}","{}"],a:0,d:"easy",ex:"An event is a subset of the sample space, e.g., {2,4,6}."},
{q:"Fair die: probability of a number greater than 4.",c:["1/3","1/2","2/3","5/6"],a:0,d:"easy",ex:"{5,6} ⇒ 2/6 = 1/3."},

{q:"Given P(E)=0.4, P(F)=0.5, P(E∩F)=0.2, find P(E∪F).",c:["0.7","0.9","0.3","0.2"],a:0,d:"normal",ex:"Use inclusion–exclusion: 0.4+0.5−0.2=0.7."},
{q:"Given P(A∩B)=0.24 and P(B)=0.6, find P(A|B).",c:["0.4","0.24","0.6","0.14"],a:0,d:"normal",ex:"P(A|B)=P(A∩B)/P(B)=0.24/0.6=0.4."},
{q:"A and B independent with P(A)=0.3 and P(B)=0.5. Find P(A∩B).",c:["0.15","0.8","0.3","0.5"],a:0,d:"normal",ex:"Independent ⇒ P(A∩B)=P(A)P(B)=0.15."},
{q:"Draw one card. Probability of an Ace.",c:["1/13","1/4","4/13","1/52"],a:0,d:"normal",ex:"Aces: 4/52 = 1/13."},
{q:"Two dice: probability the sum is 7.",c:["1/6","1/12","1/9","1/36"],a:0,d:"normal",ex:"6 favorable pairs over 36 outcomes ⇒ 1/6."},
{q:"Conditional: P(even | roll > 3) for a fair die.",c:["2/3","1/3","1/2","5/6"],a:0,d:"normal",ex:"Given >3 ⇒ {4,5,6}. Evens {4,6} ⇒ 2/3."},
{q:"P(A)=0.5, P(B)=0.4, P(A∩B)=0.2. Are A and B independent?",c:["Yes","No","Cannot be determined","Only if P(A|B)=0.5"],a:0,d:"normal",ex:"P(A)P(B)=0.2 equals P(A∩B) ⇒ independent."},
{q:"Complement of Ace event in a single draw.",c:["12/13","1/13","1/26","3/13"],a:0,d:"normal",ex:"Not an Ace: 48/52 = 12/13."},
{q:"Given P(A)=0.6, P(B)=0.5, P(A∩B)=0.3, find P(A∪B).",c:["0.8","0.6","1.1","0.3"],a:0,d:"normal",ex:"0.6+0.5−0.3=0.8."},
{q:"Given P(A|B)=0.4 and P(B)=0.5, find P(A∩B).",c:["0.2","0.4","0.9","0.1"],a:0,d:"normal",ex:"P(A∩B)=0.4×0.5=0.2."},
{q:"Flip 3 coins: probability of exactly two heads.",c:["3/8","1/8","1/2","5/8"],a:0,d:"normal",ex:"C(3,2)/8 = 3/8."},

{q:"Find P(A∩B) given P(A∪B)=0.9, P(A)=0.7, P(B)=0.5.",c:["0.3","0.1","0.9","0.0"],a:0,d:"hard",ex:"P(A∩B)=P(A)+P(B)−P(A∪B)=0.3."},
{q:"Two cards without replacement: probability both are aces.",c:["1/221","1/169","1/52","1/26"],a:0,d:"hard",ex:"4/52 × 3/51 = 12/2652 = 1/221."},
{q:"P(sum=10 | first die is even) for two fair dice.",c:["1/9","1/6","1/12","2/9"],a:0,d:"hard",ex:"Given first die even ⇒ 18 outcomes; favorable (4,6),(6,4) ⇒ 2/18=1/9."},
{q:"Urn: 5 red, 7 blue. P(red on 2nd | red on 1st).",c:["4/11","5/12","5/11","7/12"],a:0,d:"hard",ex:"After red, 4 red, 7 blue remain ⇒ 4/11."},
{q:"P(heart | face card) in a 52-card deck.",c:["1/4","1/3","1/12","3/12"],a:0,d:"hard",ex:"12 face cards, 3 hearts among them ⇒ 3/12=1/4."},
{q:"Given P(A)=0.7, P(B)=0.6, P(A|B)=0.8, find P(B|A).",c:["24/35","0.8","3/5","2/3"],a:0,d:"hard",ex:"P(B|A)=P(A|B)P(B)/P(A)=0.8×0.6/0.7=24/35."},
{q:"Red card given the card is a face card.",c:["1/2","1/3","2/3","3/4"],a:0,d:"hard",ex:"6 red face cards out of 12 ⇒ 1/2."},
{q:"Fair die: P(number ≤ 2 | number is even).",c:["1/3","1/2","2/3","1/6"],a:0,d:"hard",ex:"Given even {2,4,6}. ≤2 is {2} ⇒ 1/3."},

{q:"Bayes: P(spam|promo) if P(spam)=0.3, P(promo|spam)=0.9, P(promo|not spam)=0.1.",c:["27/34","3/10","9/10","7/34"],a:0,d:"hacker",ex:"P=0.3×0.9/(0.3×0.9+0.7×0.1)=27/34."},
{q:"Bayes medical: prev=0.02, sens=0.95, spec=0.9. P(disease|positive).",c:["19/117","1/5","0.5","2/9"],a:0,d:"hacker",ex:"0.02×0.95/(0.02×0.95+0.98×0.1)=19/117."},
{q:"Medical test twice: prev=0.02, sens=0.95, spec=0.9. P(disease|two positives).",c:["361/557","1/2","2/3","9/10"],a:0,d:"hacker",ex:"Use independence: numerator 0.02×0.95^2; denom adds false positives (0.98×0.1^2)."},
{q:"Three boxes priors (0.5,0.3,0.2) red probs (0.4,0.7,0.2). Posterior P(Box2|red).",c:["7/15","2/5","1/2","3/7"],a:0,d:"hacker",ex:"0.3×0.7/(0.5×0.4+0.3×0.7+0.2×0.2)=7/15."},
{q:"Two cards from deck: P(both aces | at least one ace).",c:["1/33","1/13","1/221","2/33"],a:0,d:"hacker",ex:"P= (4C2)/(52C2 − 48C2) × appropriate ratio = 1/33."},
{q:"Given P(A)=0.4, P(B)=0.5, P(A|B)=0.7, find P(B|A).",c:["7/8","3/4","1/2","2/5"],a:0,d:"hacker",ex:"0.7×0.5/0.4=0.875=7/8."},
{q:"Given P(A∪B)=0.9, P(A|B)=0.8, P(B)=0.6, find P(A|B^c).",c:["3/4","1/2","2/3","4/5"],a:0,d:"hacker",ex:"P(A)=0.78, then solve P(A|B^c)=(P(A)−P(A|B)P(B))/(1−P(B))=3/4."},
{q:"Urn with replacement: 3 red, 2 blue. P(red on both draws).",c:["9/25","3/10","6/25","1/5"],a:0,d:"hacker",ex:"With replacement: (3/5)^2=9/25."},
{q:"Diagnostic with base rate fallacy: prev=0.01, sens=0.99, spec=0.95. P(disease|positive).",c:["99/594","1/2","19/20","1/100"],a:0,d:"hacker",ex:"0.01×0.99/(0.01×0.99+0.99×0.05)=99/594≈1/6."}
];
if(!raw||ver!==String(DEFAULT_BANK_VERSION)){questions=defaults;localStorage.setItem("module9_questions_version",String(DEFAULT_BANK_VERSION))}else{questions=JSON.parse(raw)}
}
function saveQuestions(){localStorage.setItem("module9_questions",JSON.stringify(questions))}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function startGame(){loadQuestions();const hasTags=questions.some(q=>Object.prototype.hasOwnProperty.call(q,'d'));let pool=hasTags?questions.map((q,i)=>({q,i})).filter(x=>x.q.d===difficulty).map(x=>x.i):[...Array(questions.length).keys()];if(pool.length===0){pool=[...Array(questions.length).keys()]}order=shuffle(pool);idx=0;score=0;lives=3;time=BASE_TIME[difficulty];correctCount=0;answered=0;wrongLog=[];gameOver=false;scoreEl.textContent=score;timerEl.textContent=time;qtotalEl.textContent=order.length;updateNinjaLives();showSection("play");renderQuestion();startTimer()}
function startTimer(){clearInterval(timer);timer=setInterval(()=>{time--;timerEl.textContent=time;if(time<=3){timerEl.classList.add('critical')}else{timerEl.classList.remove('critical')}if(time<=0){handleAnswer(-1,-1)}},1000)}
function renderQuestion(){const q=questions[order[idx]];qnumEl.textContent=idx+1;qtotalEl.textContent=order.length;progressBar.style.width=((idx)/order.length*100)+"%";questionEl.textContent=q.q;choicesEl.innerHTML="";if(explainEl) explainEl.textContent="";choiceOrder=shuffle([0,1,2,3]);currentButtons=[];choiceOrder.forEach((orig,di)=>{const b=document.createElement("button");b.textContent=q.c[orig];b.onclick=()=>handleAnswer(orig,di);currentButtons.push(b);choicesEl.appendChild(b)})}
function nextQuestion(){
	// Reset combat state and redraw sprites
	if(ninjaEl){ ninjaEl.classList.remove('hit') }
	if(enemyEl){
		enemyEl.classList.remove('dead')
		enemyEl.classList.remove('dead-spark')
		enemyEl.classList.remove('attack')
	}
	drawAllSprites()
	idx++
	if(idx>=order.length||lives<=0){
		endGame()
	}else{
		time=Math.max(MIN_TIME[difficulty],BASE_TIME[difficulty]-Math.floor(idx/3))
		timerEl.textContent=time
		renderQuestion()
	}
}
function handleAnswer(origIdx,di){
	clearInterval(timer)
	const q = questions[order[idx]]
	answered++
	const correctDi = choiceOrder.indexOf(q.a)
	if(origIdx === -1){
		spawnExplosion()
		streak = 0
		// animate life loss then update
		const newLives = Math.max(0, lives-1)
		animateLifeLoss(()=>{ lives = newLives; updateNinjaLives(); })
		animateEnemyAttack()
		wrongLog.push({question:q.q,correct:q.c[q.a],ex:q.ex})
	} else if(origIdx === q.a){
		correctCount++
		streak++
		const bonus = (streak>=5?10:(streak>=3?5:0))
		score += 10 + Math.max(0, time) + bonus
		scoreEl.textContent = score
		if(di>=0) currentButtons[di]?.classList.add('correct')
		spawnConfetti()
		animateEnemyDie()
	} else {
		streak = 0
		// wrong answer: animate life loss
		const newLives = Math.max(0, lives-1)
		animateLifeLoss(()=>{ lives = newLives; updateNinjaLives(); })
		animateEnemyAttack()
		wrongLog.push({question:q.q,correct:q.c[q.a],ex:q.ex})
		if(di>=0) currentButtons[di]?.classList.add('wrong')
		currentButtons[correctDi]?.classList.add('correct')
	}
	if(q.ex && explainEl){ explainEl.textContent = q.ex }
	setTimeout(()=>{if(!gameOver){nextQuestion();if(!paused){startTimer()}}},1200)
}

function endGame(){clearInterval(timer);gameOver=true;const acc=answered?Math.round((correctCount/answered)*100):0;finalScoreEl.textContent=score;accuracyEl.textContent=acc+"%";reviewEl.innerHTML=wrongLog.length?wrongLog.map(w=>`<div>Missed: ${w.question}<br>Answer: ${w.correct}${w.ex?`<br>Why: ${w.ex}`:''}</div>`).join(""):"All correct";showSection("result")}
function renderList(){questionList.innerHTML="";questions.forEach((qq,qi)=>{const li=document.createElement("li");const t=document.createElement("div");t.textContent=qq.q;const del=document.createElement("button");del.className="btn danger";del.textContent="Delete";del.onclick=()=>{questions.splice(qi,1);saveQuestions();renderList()};li.appendChild(t);li.appendChild(del);questionList.appendChild(li)})}
navBtns.forEach(b=>b.addEventListener("click",()=>{
	const section = b.dataset.section
	// remember currently visible screen
	const currentVisible = Object.keys(screens).find(k=>screens[k] && !screens[k].classList.contains('hidden'))
	// when opening instructions or manage while play is visible, pause the game
	if((section === 'instructions' || section === 'manage') && screens.play && !screens.play.classList.contains('hidden') && !gameOver){
		clearInterval(timer)
		paused = true
		pausedFromOverlay = true
		if(pauseBtn) pauseBtn.textContent = 'Resume'
	}
	// If user clicks Home while play is visible, pause the running game so it does not continue in background
	if(section === 'home'){
		if(screens.play && !screens.play.classList.contains('hidden') && !gameOver){
			clearInterval(timer)
			paused = true
			if(pauseBtn) pauseBtn.textContent = 'Resume'
		}
	}
	if(!b.id || (b.id!=='help-btn' && b.id!=='pause-btn')){ showSection(section) }
}))
startBtn.addEventListener("click",startGame)
restartBtn.addEventListener("click",startGame)
difficultyBtns.forEach(btn=>btn.addEventListener('click',()=>{difficultyBtns.forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');difficulty=btn.dataset.difficulty}))
if(helpBtn){helpBtn.addEventListener('click',()=>{tutorial.classList.remove('hidden')})}
if(closeTutorial){closeTutorial.addEventListener('click',()=>{tutorial.classList.add('hidden');localStorage.setItem('module9_seen_tutorial','1')})}
if(closeInstructionsBtn){closeInstructionsBtn.addEventListener('click',()=>{
	// if we came from play, return to play and resume timer, otherwise go home
	const target = (screens.play && !screens.play.classList.contains('hidden'))? 'play' : 'home'
	// prefer resuming play if game not over and play was paused by opening overlay
	if(pausedFromOverlay && !gameOver){ showSection('play'); paused=false; startTimer(); pausedFromOverlay=false; if(pauseBtn) pauseBtn.textContent='Pause' }
	else { showSection('home') }
	// ensure tutorial overlay not interfering
	if(tutorial) tutorial.classList.add('hidden')
})}
if(closeManageBtn){closeManageBtn.addEventListener('click',()=>{
	if(pausedFromOverlay && !gameOver){ showSection('play'); paused=false; startTimer(); pausedFromOverlay=false; if(pauseBtn) pauseBtn.textContent='Pause' }
	else { showSection('home') }
})}
if(pauseBtn){pauseBtn.addEventListener('click',()=>{paused=!paused;if(paused){clearInterval(timer);pauseBtn.textContent='Resume'}else{pauseBtn.textContent='Pause';startTimer()}})}
if(!localStorage.getItem('module9_seen_tutorial') && tutorial){tutorial.classList.remove('hidden')}
form.addEventListener("submit",e=>{e.preventDefault();const q=qText.value.trim();const a0=c0.value.trim();const a1=c1.value.trim();const a2=c2.value.trim();const a3=c3.value.trim();const ai=parseInt(answerIndexSel.value,10);const dd=diffSel?diffSel.value:undefined;if(q&&a0&&a1&&a2&&a3){questions.push({q:q,c:[a0,a1,a2,a3],a:ai,d:dd});saveQuestions();renderList();qText.value="";c0.value="";c1.value="";c2.value="";c3.value=""}})
function spawnConfetti(){for(let i=0;i<16;i++){const p=document.createElement('div');p.className='confetti';p.style.background=`hsl(${Math.random()*360},80%,60%)`;p.style.left=Math.random()*window.innerWidth+'px';p.style.top=(window.scrollY+50+Math.random()*100)+'px';document.body.appendChild(p);setTimeout(()=>{p.style.transition='transform .8s ease, opacity .8s ease';p.style.transform='translateY(120px)';p.style.opacity='0'},20);setTimeout(()=>p.remove(),900)}}
function animateLifeLoss(cb){
	if(!ninjaLivesEl) { if(cb) cb(); return }
	const spans = ninjaLivesEl.querySelectorAll('.life')
	if(!spans || spans.length===0){ if(cb) cb(); return }
	const last = spans[spans.length-1]
	last.classList.add('lost')
	// after animation remove and then call callback
	setTimeout(()=>{
		if(last && last.parentNode) last.parentNode.removeChild(last)
		if(cb) cb()
	},600)
}

function updateNinjaLives(){
	// render small shuriken/diamond life icons instead of plain hearts
	const renderLives = (el, n) => {
		if(!el) return
		el.innerHTML = ''
		for(let i=0;i<n;i++){
			const span = document.createElement('span')
			span.className = 'life'
			el.appendChild(span)
		}
		if(n===0){el.textContent = '—'}
	}
	renderLives(ninjaLivesEl, lives)
	renderLives(livesEl, lives)
}

// Frame animation helper for canvas-based sprites
function playAnimation(canvas, frames, palette, fps=10, loop=false, onEnd){
	if(!canvas || !frames || frames.length===0) return
	let i=0
	const interval = Math.max(20, Math.floor(1000/fps))
	// draw first frame immediately
	drawMapToCanvas(canvas, frames[0], palette)
	const handle = setInterval(()=>{
		i++
		if(i>=frames.length){
			if(loop){i=0}else{clearInterval(handle); if(onEnd) onEnd(); return}
		}
		drawMapToCanvas(canvas, frames[i], palette)
	}, interval)
	return ()=>clearInterval(handle)
}

// attack/die frames are defined later as improved multi-frame arrays

function animateEnemyDie(){
	if(!enemyEl || !enemyCanvas) return
	enemyEl.classList.add('dead-spark')
	// play canvas frames then remove classes
	playAnimation(enemyCanvas, enemyDieFrames, enemyPal, 8, false, ()=>{
		enemyEl.classList.add('dead')
		setTimeout(()=>{enemyEl.classList.remove('dead');enemyEl.classList.remove('dead-spark')},800)
	})
}

function animateEnemyAttack(){
	if(!enemyEl||!ninjaEl) return
	// visual class animations for quick feedback
	ninjaEl.classList.add('hit')
	enemyEl.classList.add('attack')
	// play small canvas attack frames on enemy and ninja
	playAnimation(enemyCanvas, enemyAttackFrames, enemyPal, 12, false)
	playAnimation(ninjaCanvas, ninjaAttackFrames, ninjaPal, 12, false)
	setTimeout(()=>{ninjaEl.classList.remove('hit');enemyEl.classList.remove('attack')},450)
}
function spawnExplosion(){
	// do not spawn explosions when Play screen is not visible
	if(screens.play && screens.play.classList.contains('hidden')) return
	const explosion=document.getElementById('bomb-explosion');
	if(!explosion) return;
	explosion.classList.remove('hidden');
	const debrisContainer=explosion.querySelector('.explosion-debris');
	debrisContainer.innerHTML='';
	for(let i=0;i<12;i++){
		const debris=document.createElement('div');
		debris.className='debris-item';
		const angle=Math.random()*Math.PI*2;
		const velocity=80+Math.random()*120;
		const tx=Math.cos(angle)*velocity;
		const ty=Math.sin(angle)*velocity;
		debris.style.setProperty('--tx',tx+'px');
		debris.style.setProperty('--ty',ty+'px');
		debris.style.left='50px';
		debris.style.top='50px';
		debris.style.width=Math.random()*30+15+'px';
		debris.style.height=debris.style.width;
		debris.style.animationDelay=(Math.random()*0.3)+'s';
		debris.style.background=Math.random()>.5?'#ff6b35':'#ff8c42';
		debrisContainer.appendChild(debris);
	}
	document.body.style.animation='shake .6s ease-in-out';
	// clear the shake and hide explosion only if Play is still visible
	setTimeout(()=>{
		document.body.style.animation='';
		if(screens.play && !screens.play.classList.contains('hidden')){
			explosion.classList.add('hidden');
		} else {
			// ensure debris cleared if user left the play screen while explosion ran
			explosion.classList.add('hidden');
			const debris = explosion.querySelector('.explosion-debris');
			if(debris) debris.innerHTML = '';
		}
	},1200)
}

resetDefaultsBtn.addEventListener("click",()=>{localStorage.removeItem("module9_questions");loadQuestions();saveQuestions();renderList()})
clearAllBtn.addEventListener("click",()=>{questions=[];saveQuestions();renderList()})
loadQuestions();saveQuestions();renderList();showSection("home")

/* ---------- Generated pixel characters ---------- */
const ninjaCanvas = document.getElementById('ninja-canvas')
const enemyCanvas = document.getElementById('enemy-canvas')

function drawMapToCanvas(canvas, map, palette){
	if(!canvas) {
		console.warn('Canvas not found')
		return
	}
	const ctx = canvas.getContext('2d')
	if(!ctx) return
	const mapH = map.length
	const mapW = map[0] ? map[0].length : 16
	// Scale canvas internal resolution to match desired display size
	const displayScale = 4 // 16x16 -> 64x64 internal -> CSS scales to 112x128
	canvas.width = mapW * displayScale
	canvas.height = mapH * displayScale
	ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.imageSmoothingEnabled = false
	for(let y=0;y<mapH;y++){
		const row = map[y]
		for(let x=0;x<mapW;x++){
			const ch = row[x]
			if(ch === '.' || ch === ' ') continue
			const color = palette[ch] || '#000000'
			ctx.fillStyle = color
			ctx.fillRect(x*displayScale, y*displayScale, displayScale, displayScale)
		}
	}
}

// Improved 20x24 ninja sprite frames (idle, attack, die) with blue headband and sword
const ninjaPal = {n:'#1a1a1a', h:'#00d4ff', b:'#0088ff', r:'#ff6b35', s:'#888888', g:'#ffb48a', w:'#f5e6d3'}
const ninjaIdleFrames = [
	// frame 0 - idle with headband
	[
	".....................",
	"........bbbbb.........",
	".......bbbhbbb.......",
	".......bhhbhhb.......",
	"......bhwwwwwbh......",
	"......bnnnnnnnb......",
	"......nnnrrrnnn......",
	"......nnnsssnsn......",
	"......nnnnnnnnn......",
	"......nnnnnnnnn......",
	".....nnnnnnnnnnn.....",
	".....nnggggggnnn.....",
	".....nnggggggnnn.....",
	"......nnggggnnn......",
	".......nnggnnn.......",
	"......nnnsssnsn......",
	"......nnnsssnsn......",
	".......gswwswg.......",
	".......gswwswg.......",
	"........wwwwww........",
	"........wwwwww........",
	"........wwwwww........",
	"........wwwwww........",
	".....................",
	],
	// frame 1 - idle bob
	[
	".....................",
	"........bbbbb.........",
	".......bbbhbbb.......",
	".......bhhbhhb.......",
	"......bhwwwwwbh......",
	"......bnnnnnnnb......",
	"......nnnrrrnnn......",
	"......nnnsssnsn......",
	"......nnnnnnnnn......",
	"......nnnnnnnnn......",
	".....nnnnnnnnnnn.....",
	".....nnggggggnnn.....",
	".....nnggggggnnn.....",
	"......nnggggnnn......",
	".......nnggnnn.......",
	"......nnnsssnsn......",
	"......nnnsssnsn......",
	".......gswwswg.......",
	".......gswwswg.......",
	"........wwwwww........",
	"........wwwwww........",
	"........wwwwww........",
	".....................",
	".....................",
	]
]

const ninjaAttackFrames = [
	// sword raised attack
	[
	"......sssss......",
	"......sssss......",
	".....ssbssbs.....",
	".....sbbbsbs.....",
	"....ssbbbssbs....",
	"...ssbbbsbbss....",
	"....sbsbbbsbs....",
	".....sbsbbbsbs...",
	"......ssbbbsbs...",
	"........ssbsss...",
	"....hhhbbbbsss...",
	"...hhhhhbbsss....",
	"...hhhhhhs.......",
	"....hhhh.........",
	".....hh..........",
	"................"
	],
	// strike frame
	[
	"......sssss......",
	"......sssss......",
	".....ssbssbs.....",
	".....sbbbsbs.....",
	"....ssbbbssbs....",
	"...ssbbbsbbss....",
	"....sbsbbbsbs....",
	".....sbsbbbsbs...",
	"......ssbbbsbs...",
	"........ssbsss...",
	"....hhhbbbbsss...",
	"...hhhhhbbsss....",
	"...hhhhhhs.......",
	"....hhhh.........",
	".....hh..........",
	"................"
	]
]

const ninjaDieFrames = [
	// fall frame 1
	[
	"..................",
	"......hhhhh.......",
	".....hhhhhhhh.....",
	"....hhbbbhhh.....",
	"....hbwwwbhh.....",
	"....hbwbwbhh.....",
	"....hbwwwbhh.....",
	"....hhbbbhh......",
	"...hhhhhhhhh.....",
	"..hhhhhhhhhhhh...",
	"....hhhggghh.....",
	"....hggggghh.....",
	".....hhggghh.....",
	"......hh.........",
	".................",
	"................."
	],
	// fall frame 2 (tilted)
	[
	"..................",
	"..................",
	".....hhhhh........",
	"....hhhhhhhh......",
	"...hhbbbhhh.......",
	"...hbwwwbhh.......",
	"...hbwbwbhh.......",
	"...hbwwwbhh.......",
	"...hhbbbhh........",
	"...hhhhhhhhh......",
	".....hhhhh........",
	".....hggghh.......",
	".....hggggghh.....",
	"......hh.........",
	"..................",
	"................."
	],
	// dissolve frame
	[
	"..................",
	"..................",
	"..................",
	"..h.h.h..h........",
	"...h.hh.h.h.......",
	"....h..h.h........",
	"....h.h...h.......",
	"...h..h.h.h.......",
	"..................",
	".......h..h.......",
	".......hh..h......",
	".......h.h........",
	"......h..h........",
	"..................",
	"..................",
	"................."
	]
]

// Improved enemy frames (idle, attack, die)
const enemyPal = {e:'#7b2e6f', p:'#9d3fa8', o:'#ffdca8', y:'#ffff00', g:'#00ff00'}
const enemyIdleFrames = [
	// demon idle frame 1
	[
	"..................",
	"..................",
	"......pppppp......",
	".....pppoopppp....",
	"....ppo...oppp....",
	"....poyg..goppp...",
	"....poyg..goppp...",
	"....po.....oppp...",
	".....ppoooooppp...",
	".....pppppppppp...",
	"....ppeepeepp....",
	"....ppeeepeepp....",
	"...pppeeeppppp...",
	"....ppppppppp.....",
	".....ppppppp......",
	".................."
	],
	// demon idle frame 2 (breathe)
	[
	"..................",
	"..................",
	"......pppppp......",
	".....pppoopppp....",
	"....ppo...oppp....",
	"....poyg..goppp...",
	"....poyg..goppp...",
	"....po.....oppp...",
	".....ppoooooppp...",
	".....pppppppppp...",
	"....ppeepeepp....",
	"....ppeyypeepp....",
	"...pppeyyppppp...",
	"....ppppppppp.....",
	".....ppppppp......",
	".................."
	]
]

const enemyAttackFrames = [
	// demon attack frame 1 (lunge)
	[
	"..................",
	"..................",
	".....pppppp.......",
	"....pppoopppp....",
	"...ppo...oppp....",
	"...poyg..goppp...",
	"...poyg..goppp...",
	"...po.....oppp...",
	"....ppoooooppp...",
	"....pppppppppp...",
	"...ppeepeepp.....",
	"...ppeyypeepp.....",
	"..pppeyypppppp...",
	"...ppppppppp.....",
	"....pppppp.......",
	".................."
	],
	// demon attack frame 2 (strike with glow)
	[
	"..................",
	"..................",
	".....pppppp.......",
	"....pppoopppp....",
	"...ppo...oppp....",
	"...poyy..yyppp...",
	"...poyy..yyppp...",
	"...po.....oppp...",
	"....ppoooooppp...",
	"....pppppppppp...",
	"...ppeepeepp.....",
	"...ppeyygeepp.....",
	"..pppeyygppppp...",
	"...ppppppppp.....",
	"....pppppp.......",
	".................."
	]
]

const enemyDieFrames = [
	// die frame 1
	[
	"..................",
	"..................",
	".....ppp.pp.......",
	"....ppp..pppp....",
	"...pp.....pp....",
	"...poy....ppp...",
	"...poy....ppp...",
	"...p.......pp...",
	"....p.....pp....",
	".....pp..ppp....",
	"...p.e..e.pp.....",
	"...pp.e..epp.....",
	"..ppp.e.pppp...",
	"...ppppp.pp.....",
	"....pp.pp.......",
	".................."
	],
	// die frame 2 (dissolve)
	[
	"..................",
	"..................",
	".....p...p.......",
	"....p.....pp....",
	"...p.......p....",
	"...p.y....p....",
	"...p.y....p....",
	"..................",
	"....p.....p.....",
	".....p...p......",
	"...p.........p...",
	"...p........p....",
	"..p...........p..",
	"..................",
	"....p..p.........",
	".................."
	],
	// die frame 3 (gone)
	[
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	"..................",
	".................."
	]
]

function drawAllSprites(){
	// draw first idle frame for each
	drawMapToCanvas(ninjaCanvas, ninjaIdleFrames[0], ninjaPal)
	drawMapToCanvas(enemyCanvas, enemyIdleFrames[0], enemyPal)
	if(ninjaCanvas) ninjaCanvas.classList.add('idle')
	if(enemyCanvas) enemyCanvas.classList.add('idle')
}

// draw sprites at start and whenever play section is shown
drawAllSprites()
window.addEventListener('resize', ()=>{drawAllSprites()})

// ensure sprites are re-drawn when game starts
const originalStart = startGame
startGame = function(){originalStart(); drawAllSprites()}
