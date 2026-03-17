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
        document.getElementById('listagiocatori').innerHTML=document.getElementById('listagiocatori').innerHTML + "<input type='text' name='giocatore1'></input>";
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