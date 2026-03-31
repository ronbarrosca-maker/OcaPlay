let numGiocatori = 2;
let giocatoriData = []; 
let turno = 0;
const totaleCaselle = 50;
const coloriG = ["red", "blue", "green", "orange"];

// --- MENU SELEZIONE ---
function mostraGiocatori(){
    document.getElementById('conteggio-giocatori').innerText = numGiocatori;
}
function aumentaGiocatori(){
    if(numGiocatori < 4) numGiocatori++;
    mostraGiocatori();
}
function diminuisciGiocatori(){
    if(numGiocatori > 2) numGiocatori--;
    mostraGiocatori();
}

// --- LOGICA SCHERMATE ---
function gestisciAvanti() {
    document.getElementById('finestra-menu').classList.add('nascosto');
    document.getElementById('finestra-nomi').classList.remove('nascosto');
    creaCaselleNomi(numGiocatori);
}

function creaCaselleNomi(n){
    const contenitore = document.getElementById('listainput');
    contenitore.innerHTML = ""; 
    for(let i=0; i<n; i++){
        contenitore.innerHTML += `
            <input type="text" class="input-nome" placeholder="Nome G${i+1}" 
            style="padding:10px; border:2px solid #333; border-radius:10px; width:100%; box-sizing:border-box;">`;
    }
}

function tornaindietro(){
    document.getElementById('finestra-menu').classList.remove('nascosto');
    document.getElementById('finestra-nomi').classList.add('nascosto');
}

function GiocaAvanti(){
    const inputs = document.querySelectorAll('.input-nome');
    giocatoriData = []; 
    
    inputs.forEach((input, i) => {
        giocatoriData.push({
            nome: input.value.toUpperCase() || "G" + (i+1),
            pos: 1,
            colore: coloriG[i]
        });
    });

    document.getElementById('finestra-nomi').classList.add('nascosto');
    document.getElementById('schermo-gioco').classList.remove('nascosto');
    
    generaMappa();
    aggiornaTurnoUI();
}

function Chiudifinestra(){
    if(confirm("Vuoi chiudere il gioco?")) window.close();
}

// --- LOGICA GIOCO ---
function generaMappa() {
    const campo = document.getElementById('campo-gioco');
    campo.innerHTML = ''; 
    for (let i = 1; i <= totaleCaselle; i++) {
        const div = document.createElement('div');
        div.innerText = i;
        div.className = "div" + i; 
        campo.appendChild(div);
    }
    disegnaPedine();
}

function disegnaPedine() {
    document.querySelectorAll('.pedina').forEach(p => p.remove());
    giocatoriData.forEach((g, index) => {
        const casella = document.querySelector('.div' + g.pos);
        if (casella) {
            const pEl = document.createElement('div');
            pEl.className = 'pedina';
            pEl.style.backgroundColor = g.colore;
            // Spostamento se sulla stessa casella
            pEl.style.marginLeft = (index * 4) + "px"; 
            casella.appendChild(pEl);
        }
        if (g.pos = 13) {
            g.pos = g.pos - 3; 
        }
    });
}

function gestisciLancio() {
    let dado = Math.floor(Math.random() * 6) + 1;
    document.getElementById('testo-risultato').innerText = dado;

    let p = giocatoriData[turno];
    p.pos += dado;

    if (p.pos >= totaleCaselle) {
        p.pos = totaleCaselle;
        disegnaPedine();
        setTimeout(() => { alert("Vince " + p.nome + "!"); location.reload(); }, 300);
        return;
    }

    disegnaPedine();
    turno = (turno + 1) % giocatoriData.length;
    aggiornaTurnoUI();
}

function aggiornaTurnoUI() {
    const p = giocatoriData[turno];
    const stato = document.getElementById('testo-stato');
    stato.innerText = p.nome;
    stato.style.color = p.colore;
}


