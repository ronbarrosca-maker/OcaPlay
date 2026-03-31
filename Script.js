let numGiocatori = 2;
function mostraGiocaatori(){
    document.getElementById('conteggio-giocatori').innerText = numGiocatori;
}
function aumentaGiocatori(){
if(numGiocatori<4){
 numGiocatori++;
}
 mostraGiocaatori();
}
function diminuisciGiocatori(){
    if(numGiocatori>2){
    numGiocatori--;
    }
    mostraGiocaatori();
}
function gestisciAvanti() {
    document.getElementById('finestra-menu').classList.add('nascosto');
    document.getElementById('finestra-nomi').classList.remove('nascosto');
    var n = document.getElementById('conteggio-giocatori').innerText;
    creacaselle(n);
}
function creacaselle(n){
    for(let i=0;i<n;i++){
        document.getElementById('listainput').innerHTML=document.getElementById('listainput').innerHTML + "<input type='text' name='giocatore1'></input>";
    }
}
function Chiudifinestra(){
    window.close();
}
function tornaindietro(){
    document.getElementById('listainput').innerHTML="";   
    document.getElementById('finestra-menu').classList.remove('nascosto');
    document.getElementById('finestra-nomi').classList.add('nascosto');
}
function GiocaAvanti(){
    document.getElementById('finestra-gioco').classList.remove('nascosto');
    document.getElementById('finestra-nomi').classList.add('nascosto');
}
function apriImp(){
    document.getElementById('impostazioni').classList.remove('nascosto');
    document.getElementById('finestra-nomi').classList.add('nascosto');
}
function tornaindietroimp(){
    document.getElementById('impostazioni').classList.add('nascosto');
    document.getElementById('finestra-nomi').classList.remove('nascosto');
}
function apriImpPartita(){
    document.getElementById('impostazioni').classList.remove('nascosto');
    document.getElementById('finestra-gioco').classList.add('nascosto');
}