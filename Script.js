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

// --- LOGICA GIOCO (MOVIMENTO ANIMATO PASSO-PASSO) ---
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
            
            // Attiva l'animazione del salto solo se è il giocatore corrente ed è in movimento
            if (i === turno && staCamminando) {
                pEl.classList.add('salto');
            }
            
            contenitoreCasella.appendChild(pEl);
        }
    });
}

function gestisciLancio() {
    const bottoneTira = document.querySelector('.btn-lancio');
    bottoneTira.disabled = true; // Blocca il tasto durante la camminata

    let dado = Math.floor(Math.random() * 6) + 1;
    document.getElementById('testo-risultato').innerText = dado;

    let p = giocatoriData[turno];
    let passiMancanti = dado;
    let direzioneInAvanti = true;

    // Funzione intervallo per far avanzare la pedina una casella alla volta
    let muoviPasso = setInterval(() => {
        if (passiMancanti > 0) {
            if (direzioneInAvanti) {
                if (p.pos < totaleCaselle) {
                    p.pos++;
                } else {
                    // Rimbalzo se tocca il fondo
                    direzioneInAvanti = false;
                    p.pos--;
                }
            } else {
                p.pos--;
            }
            
            passiMancanti--;
            disegnaPedine(true); // Aggiorna graficamente attivando il saltello
        } else {
            clearInterval(muoviPasso); // Fine movimento del dado
            disegnaPedine(false); // Ferma il saltello quando si ferma sulla casella finale
            
            // Controllo della vittoria
            if (p.pos === totaleCaselle) {
                setTimeout(() => { alert("Vince " + p.nome + "!"); location.reload(); }, 300);
                return;
            }

            // Cambia turno e sblocca il pulsante
            turno = (turno + 1) % giocatoriData.length;
            aggiornaTurnoUI();
            bottoneTira.disabled = false;
        }
    }, 400); // 400 millisecondi di pausa tra ogni casella
}

function aggiornaTurnoUI() {
    const p = giocatoriData[turno];
    const stato = document.getElementById('testo-stato');
    stato.innerText = p.nome;
    stato.style.color = p.colore;
}
