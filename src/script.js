// ========================================================================
// Declaration des variables globales
// ========================================================================
let canvas;
let game;
let anim;
const HauteurJoueur = 100;
const LargeurJoueur = 5;
let HauteurJoueur1 = 100;
let Hauteurplayer2 = 100;
var VitesseMax = 15;

// =======================================================================
// CLASSE GameField PERMETTANT DE TRACER LE TERRAIN ET LES ELEMENTS DU JEU 
// =======================================================================
class GameField{
    
    costructor(){
    }
    
    draw() {
        canvas = $('#drawArea')[0];
        let context = canvas.getContext('2d');

        // Création du terrain de jeu
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Création de la ligne centrale
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        // Création des joueurs
        context.fillStyle = 'white';
        context.fillRect(0, game.player.y, LargeurJoueur, HauteurJoueur1);
        context.fillRect(canvas.width - LargeurJoueur, game.player2.y, LargeurJoueur, Hauteurplayer2);

        // Création de la balle
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
        context.fill();
    }
}

// ====================================================================================================
// CLASSE Racket PERMETTANT DE GERER LES MOUVEMENTS DU JOUEUR 1 (LA SOURIS) ET DU JOUEUR 2 (LE CLAVIER) 
// ====================================================================================================
class Racket{
    
    constructor(){
    }
    
    mouvementRacket1(){
        // Récupérer la position de la souris dans le canvas
        let canvasLocation = canvas.getBoundingClientRect();
        let mouseLocation = event.clientY - canvasLocation.y;

        // Conditions empêchant le joueur de sortir du terrain
        if (mouseLocation < HauteurJoueur1 / 2) {
            game.player.y = 0;
        }
        else if (mouseLocation > canvas.height - HauteurJoueur1 / 2) {
            game.player.y = canvas.height - HauteurJoueur1;
        }
        else {
            game.player.y = mouseLocation - HauteurJoueur1 / 2;
        }
    }
    
    mouvementRacket2(){
        const fleche = event.key;
        switch (fleche) 
        {
            case "ArrowDown":
                game.player2.y += 20;
                // Conditions empêchant le joueur de sortir du terrain
                if (game.player2.y > 500) 
                {
                    game.player2.y = 500;
                }
                break;

            case "ArrowUp":
                game.player2.y -= 20;
                // Conditions empêchant le joueur de sortir du terrain
                if (game.player2.y < 0) 
                {
                    game.player2.y = 0
                }
                break;        
            case "s":
                game.player2.y += 20;
                // Conditions empêchant le joueur de sortir du terrain
                if (game.player2.y > 500) 
                {
                    game.player2.y = 500;
                }
                break;
            case "z":
                game.player2.y -= 20;
                // Conditions empêchant le joueur de sortir du terrain
                if (game.player2.y < 0) 
                {
                    game.player2.y = 0
                }
                break;
            default:
                return; // Quitter lorsque cela ne gère pas l'événement prévu
        }
    }
}

// ==========================================================
// CLASSE Ball PERMETTANT DE GERER LES MOUVEMENTS DE LA BALLE
// ==========================================================
class Ball{
    
    constructor(){
    }
    
    collision(player){
        ball = new Ball();
         // Si le joueur rate la balle
        if (game.ball.y < player.y || game.ball.y > player.y + HauteurJoueur) {

            // Condition qui ajoute le score au bon joueur et réduit la taille de la raquête si en fonction des scores
            if (player == game.player) {
                game.player2.score++;
                $('#joueur2').text(game.player2.score);
                if (game.player2.score == 3 || game.player2.score == 6 || game.player2.score == 9) {
                    Hauteurplayer2 -= 20;
                }
            }
            else {
                game.player.score++;
                $('#joueur1').text(game.player.score);
                if (game.player.score == 3 || game.player.score == 6 || game.player.score == 9) {
                    HauteurJoueur1 -= 20;

                }
            }
            // Réinitialise les joueurs et la balle au centre 
            reset();
        }
        else {
            // Si le joueur touche la balle: Change de direction
            game.ball.speed.x *= -1;
            // Condition qui augmente la vitesse de la balle de 25% tant qu'elle n'a pas ateint le maximum
            if (Math.abs(game.ball.speed.x) < VitesseMax) {
                game.ball.speed.x *= 1.25;
            }
            ball.changementDirection(player.y);
            
        }
    }
    
    deplacementBalle(){
        
        ball = new Ball();
        // Condition pour faire rebondir la balle en haut et en bas
        if (game.ball.y > canvas.height || game.ball.y < 0) {
            game.ball.speed.y *= -1;
        }
        // Condition pour faire rebondir la balle contre les joueurs
        if (game.ball.x > canvas.width - LargeurJoueur) {
            ball.collision(game.player2);
        }
        else if (game.ball.x < LargeurJoueur) {
            ball.collision(game.player);
        }
        // Déplacements de la balle
        game.ball.x += game.ball.speed.x;
        game.ball.y += game.ball.speed.y;
        
    }
    
    changementDirection(playerPosition){
        let impact = game.ball.y - playerPosition - HauteurJoueur / 2;
        let ratio = 100 / (HauteurJoueur / 2);

        // Récupère une valeur entre 0 et 10 pour l'impact en partant du centre jusqu'au bord
        game.ball.speed.y = Math.round(impact * ratio / 10);

    }
}

// ========================================================================
// FONCTIONS PRINCIPALES POUR DEMARER STOPER ET RESET LE JEU
// ========================================================================

// Function qui permet de lancer le jeu
function play() {
        gameField.draw();
        ball.deplacementBalle();
        anim = requestAnimationFrame(play);
        
        // Condition de victoire pour les joueurs
        if (game.player.score === 11) {
            $('#saveScore').css('display', 'flex');
            $('div').css('opacity', '0.25');
            getScore();
            console.log("Le Joueur 1 à gagné !");
            alert("Le joueur 1 a gagné !")
            stopChrono();
            stop();
        }
        else if (game.player2.score === 11) {
            $('#saveScore').css('display', 'flex');
            $('div').css('opacity', '0.25');
            getScore();
            console.log("Le Joueur 2 à gagné !");
            alert("Le joueur 2 a gagné !")
            stopChrono();
            stop();
        }
}

// Fonction qui réinitialise l'emplacement de la balle et des joueurs
function reset() {
        // Repositionne la balle et les joueurs aux centre
        canvas = $('#drawArea')[0];
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - HauteurJoueur / 2;
        game.player2.y = canvas.height / 2 - HauteurJoueur / 2;

        // Réinitialise la vitesse de la balle
        game.ball.speed.x = 4;
        game.ball.speed.y = Math.random() * 3;
        
}

// Fonction qui permet d'arrêter et de réinitialiser le score
function stop() {
        scorePlayer = 10000;
        cancelAnimationFrame(anim);
        reset();
        $("#timer").html(scorePlayer);

        // Réinitialisation du score
        game.player2.score = 0;
        game.player.score = 0;

        // Remise des tailles des joueurs à 0
        HauteurJoueur1 = 100;
        Hauteurplayer2 = 100;

        // Affichage du score dans la page
        $('#joueur1').text(game.player.score);
        $('#joueur2').text(game.player2.score);

        gameField.draw();
}

// ========================================================================
// GESTION DES SCORES
// ========================================================================
function getScore(event){
    let xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = function()
    {
      if(xhr.status === 200 && xhr.readyState === 4)
      {
        let score = JSON.parse(xhr.responseText);
        console.log(score);
        for(let i=0; i < score.length; i++)
        {
            console.log(score[i]);
            let newScore = $('<p></p>')
            newScore.text(score[i].nom + "..........." + score[i].score);
            $('#scoreDisplay').append(newScore);
        }
      }
    }
    // récupération des 10 meilleurs scores
    xhr.open('GET', 'http://localhost:3000/bestPlayers/10', true); 
    xhr.send();
}
function setScore(){
        let nom = $('#inputScore').val();
        let score = $('#joueur1').val();
    }

function setScore(nom) {
    let nomGagnant = $('#inputScore').val();
    $.post('http://localhost:3000/newScore', {nom: nomGagnant, score: scorePlayer});
  }

// ========================================================================
// Gestion choronomètre
// ========================================================================
let scorePlayer = 10000;
let timerID;

function chrono(){ 
    scorePlayer -= 1;
    $("#timer").html(scorePlayer);
}

function startChrono(){
      timerID = setInterval(chrono, 1000);
}
 
function stopChrono(){
      clearTimeout(timerID);
      $("#timer").html(scorePlayer);
}

function reloadAll()
{
    window.location.reload();
}

// ========================================================================
// GESTIONNAIRE D'EVENEMENT DU JEU ET DES DIFFERENTES INTERACTIONS
// ========================================================================
$(document).ready(function() {
    game =
    {
        // Gestion du joueur 1
        player:
        {
            score: 0
        },
        // Gestion du joueur 2
        player2:
        {
            score: 0,
        },
        // Gestion de la balle
        ball:
        {
            r: 5,
            speed: {}
        }
    };
    
    // Instanciation des classes
    gameField = new GameField();
    racket = new Racket();
    ball = new Ball();
    //score = new Score();
    
    
    reset();

    // Plateau de jeu
    gameField.draw();
    
    $('canvas').on('mousemove',racket.mouvementRacket1);
    $('#start').click(play);
    $('#start').click(startChrono);
    $('#stop').click(stopChrono);
    $('#stop').click(stop);

    $(document).on('keydown', racket.mouvementRacket2);
    
    
    $('#saveScoreButton').click(setScore); // appel setScore quand on clique sur "enregistrer"
    $('#closeScoreButton').click(reloadAll); // reload la page lorsque l'on ferme le tableau les scores à la fin de la partie
    //$(document).keydown(racket.mouvementRacket2);
    
  });

