let numGiocatori = 2;
let giocatoriData = []; 
let turno = 0;
const totaleCaselle = 50;
const coloriG = ["red", "blue", "green", "orange"];

// Oggetto vuoto che verrà riempito casualmente all'inizio di ogni partita
let caselleSpeciali = {};

// Elenco di tutti gli effetti disponibili con le loro emoji e messaggi
const tipiDiEffetti = [
    { tipo: "AVANZAMENTO", valore: 2,  info: "🚀 Avanzamento Rapido! +2 caselle extra!" },
    { tipo: "REPLAY",      valore: 0,  info: "🎲 Lancio Supplementare! Tira di nuovo!" },
    { tipo: "MOLTIPLICA",  valore: 2,  info: "✨ Moltiplicatore! Raddoppia l'ultimo valore!" },
    { tipo: "ARRETRA",     valore: 2,  info: "⚠️ Retrocessione! Torna indietro di 2 caselle!" },
    { tipo: "PARTENZA",    valore: 0,  info: "💥 Ritorno alla Partenza! Torna alla Casella 1!" },
    { tipo: "SOSTA",       valore: 1,  info: "🛑 Sosta Forzata! Salterai il prossimo turno!" },
    { tipo: "BLOCCO",      valore: 0,  info: "⛓️ Blocco ad Oltranza! Fermo qui finché non esce un 6!" }
];

// --- FUNZIONE PER GENERARE EFFETTI CASUALI ---
function generaCaselleSpeciali() {
    caselleSpeciali = {}; // Svuota i vecchi effetti della partita precedente
    
    // Decidi quante caselle speciali vuoi sul tabellone (es. 12 caselle su 50)
    const quantitaSpeciali = 12; 
    
    while (Object.keys(caselleSpeciali).length < quantitaSpeciali) {
        // Scegli una casella a caso tra la 3 e la 48 (escludiamo partenza e arrivo fissi)
        let casellaCasuale = Math.floor(Math.random() * (totaleCaselle - 5)) + 3;
        
        // Se la casella è ancora libera, le assegniamo un effetto a caso dall'elenco
        if (!caselleSpeciali[casellaCasuale]) {
            let effettoCasuale = tipiDiEffetti[Math.floor(Math.random() * tipiDiEffetti.length)];
            caselleSpeciali[casellaCasuale] = effettoCasuale;
        }
    }
}

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
            colore: coloriG[i],
            turniDaSaltare: 0,
            bloccatoOltranza: false
        });
    });

    document.getElementById('finestra-nomi').classList.add('nascosto');
    document.getElementById('schermo-gioco').classList.remove('nascosto');
    
    // Genera la combinazione di trappole e bonus unica per QUESTA partita
    generaCaselleSpeciali();
    
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
        const divCasella = document.createElement('div');
        divCasella.className = "div" + i; 
        divCasella.id = `casella-${i}`;   
        
        const numeroTesto = document.createElement('span');
        numeroTesto.innerText = i;
        numeroTesto.style.fontSize = "0.75rem";
        numeroTesto.style.color = "#333";
        numeroTesto.style.position = "absolute";
        numeroTesto.style.top = "2px";
        numeroTesto.style.left = "4px";
        divCasella.appendChild(numeroTesto);

        // Mostra l'emoji generata casualmente per questa partita su questa casella
        if (caselleSpeciali[i]) {
            const emojiSpeciale = document.createElement('span');
            emojiSpeciale.innerText = caselleSpeciali[i].info.split(" ")[0];
            emojiSpeciale.style.fontSize = "1rem";
            emojiSpeciale.style.position = "absolute";
            emojiSpeciale.style.bottom = "2px";
            emojiSpeciale.style.right = "4px";
            divCasella.appendChild(emojiSpeciale);
        }
        
        campo.appendChild(divCasella);
    }
    disegnaPedine(false);
}

function disegnaPedine(staCamminando) {
    document.querySelectorAll('.pedina').forEach(p => p.remove());
    
    giocatoriData.forEach((g, i) => {
        const contenitoreCasella = document.getElementById(`casella-${g.pos}`);
        if (contenitoreCasella) {
            const pEl = document.createElement('div');
            pEl.className = 'pedina';
            pEl.style.backgroundColor = g.colore;
            pEl.title = g.nome; 
            
            if (i === turno && staCamminando) {
                pEl.classList.add('salto');
            }
            
            contenitoreCasella.appendChild(pEl);
        }
    });
}

function gestisciLancio() {
    const bottoneTira = document.querySelector('.btn-lancio');
    let p = giocatoriData[turno];

    if (p.turniDaSaltare > 0) {
        alert(`🛑 ${p.nome} salta questo turno!`);
        p.turniDaSaltare--;
        passaTurnoSuccessivo();
        return;
    }

    bottoneTira.disabled = true;

    let dado = Math.floor(Math.random() * 6) + 1;
    document.getElementById('testo-risultato').innerText = dado;

    if (p.bloccatoOltranza) {
        if (dado === 6) {
            alert(`🔓 ${p.nome} ha fatto 6! Sei libero dal Blocco!`);
            p.bloccatoOltranza = false;
        } else {
            alert(`⛓️ ${p.nome} ha fatto ${dado}. Resti bloccato finché non fai 6!`);
            setTimeout(() => {
                passaTurnoSuccessivo();
                bottoneTira.disabled = false;
            }, 1000);
            return;
        }
    }

    let passiMancanti = dado;
    let direzioneInAvanti = true;

    let muoviPasso = setInterval(() => {
        if (passiMancanti > 0) {
            if (direzioneInAvanti) {
                if (p.pos < totaleCaselle) {
                    p.pos++;
                } else {
                    direzioneInAvanti = false;
                    p.pos--;
                }
            } else {
                p.pos--;
            }
            
            passiMancanti--;
            disegnaPedine(true);
        } else {
            clearInterval(muoviPasso); 
            disegnaPedine(false); 
            
            if (p.pos === totaleCaselle) {
                setTimeout(() => { alert("Vince " + p.nome + "!"); location.reload(); }, 300);
                return;
            }

            // --- APPLICAZIONE REGOLE CASELLE SPECIALI ---
            let ripetiLancio = false;
            const effetto = caselleSpeciali[p.pos];

            if (effetto) {
                alert(`${p.nome} è finito sulla casella ${p.pos}:\n${effetto.info}`);

                if (effetto.tipo === "AVANZAMENTO") {
                    p.pos = Math.min(totaleCaselle, p.pos + effetto.valore);
                } 
                else if (effetto.tipo === "REPLAY") {
                    ripetiLancio = true;
                } 
                else if (effetto.tipo === "MOLTIPLICA") {
                    p.pos = p.pos + dado; 
                    if (p.pos > totaleCaselle) { 
                        p.pos = totaleCaselle - (p.pos - totaleCaselle);
                    }
                } 
                else if (effetto.tipo === "ARRETRA") {
                    p.pos = Math.max(1, p.pos - effetto.valore);
                } 
                else if (effetto.tipo === "PARTENZA") {
                    p.pos = 1;
                } 
                else if (effetto.tipo === "SOSTA") {
                    p.turniDaSaltare = effetto.valore;
                } 
                else if (effetto.tipo === "BLOCCO") {
                    p.bloccatoOltranza = true;
                }

                disegnaPedine(false);

                if (p.pos === totaleCaselle) {
                    setTimeout(() => { alert("Vince " + p.nome + "!"); location.reload(); }, 300);
                    return;
                }
            }

            if (!ripetiLancio) {
                passaTurnoSuccessivo();
            } else {
                alert(`🎲 Tocca ancora a te, ${p.nome}! Tira pure!`);
            }
            bottoneTira.disabled = false;
        }
    }, 400);
}

function passaTurnoSuccessivo() {
    turno = (turno + 1) % giocatoriData.length;
    aggiornaTurnoUI();
}

function aggiornaTurnoUI() {
    const p = giocatoriData[turno];
    const stato = document.getElementById('testo-stato');
    stato.innerText = p.nome;
    stato.style.color = p.colore;
}