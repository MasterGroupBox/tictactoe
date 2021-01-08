// Au click lancer fonction selon le mode sélectionné parmi 3 modes
// Uncomment de mode that you'd like to run
for(let i=1; i<=9; i++){
    //Mode 1 : 2 joueurs
        //document.getElementById("p"+i).addEventListener("click",function(){xo(i-1)});
    
    //Mode 2 : AI imbattable | Pas encore au point
        //document.getElementById("p"+i).addEventListener("click",function(){play(i)});
    
    //Mode 3 : AI aléatoire facile
        document.getElementById("p"+i).addEventListener("click",function(){playRandom(i);});
    }

// Code pour deux joueurs

let count = 0;
let logMsg = "Log :<br><br>";
const zero = [0,0,0,
    0,0,0,
    0,0,0];
let board = [...zero];

log("");

//Fonction 2 joueurs
function xo(i){
    let player;
    if(count % 2 == 0)
        player="X";
    else
        player="O";
    
    board[i]=player;
    drawBoard();    

    displayWinner();

    count++;
}

//Display winner
function displayWinner(){
    let winner = checkWinner(board);
    if (winner != 0){
        alert("Winner is "+winner);
        reset();
    }else if(playablePositions(board)==0){
        alert("Draw game ...")
        reset();
    }
}

//Boutton Reset
document.getElementById("button").addEventListener("click", function(){
    reset();
})

//Remettre la matrice à zero et la dessiner sur HTML
function reset(){
    alert("Reset ..."); 
    board = [...zero];
    drawBoard(); 
    logMsg="Log : <br><br>";
    log("");
}

// Code pour 1 joueur VS AI

//play easy random pick
function playRandom(i){
    board[i-1]="X";
    let playable = playablePositions(board);
    let position = playable[Math.floor(Math.random() * playable.length)];
    board[position]="O";
    drawBoard();
    displayWinner();
}

//play hard AI as per minimax algorithm
function play(i){
    board[i-1]="X";
    /*setTimeout(function(){
        alert("p");
    },1000);*/
    displayWinner();
    
    let winner = checkWinner(board);

    if(winner == 0){
        let run = mm(board,"O");
        board[run.position]="O";
        alert("Minimax chose position : "+run.position);
    }
    drawBoard();
    displayWinner();
}

// Fonction récursive minimax
function mm(checkBoard, player){
    let results = [];
    let winner = checkWinner(checkBoard);
    let playable = playablePositions(checkBoard);

    //Condition de fin
    if(playable.length == 0 || winner!=0)
        switch(winner){
            case "O":
                return 10;
            case "X":
                return -10;
            default:
                return 0;
        }
    else{
        //Sinon, calculer le score de chaque case vide par appel de minimax - Récursivité se passe ici
        for(let i=0;i<playable.length;i++){
            checkBoard[playable[i]]=player;
            results.push({position:i,score:mm(checkBoard, otherPlayer(player)).score});
        }

        //Aprés avoir collecté les scores, retourner le min si c'est le tour de l'humain sinon le max
        if(player == "X")
            return min(results);
        else
            return max(results);
    }
}

function min(results){
    let min = results[0];

    for(let i=0;i<results.length;i++)
        if(results[i].score < min.score)
            min = results[i];
    
    return min;
}

function max(results){
    let max = results[0];

    for(let i=0;i<results.length;i++)
        if(results[i].score > max.score)
            max = results[i];
    
    return max;
}

function otherPlayer(player){
    if(player == "X")
        return "O";
    else return "X";
}

//Retourne liste des positions restantes à jouer
function playablePositions(checkBoard){
    let playable = [];

    for(let i=0;i<9;i++){
        if(checkBoard[i]==0)
            playable.push(i);
    }

    return playable;
}

// Vérification du gagnant
function checkWinner(checkBoard){
    let winner = 0;
    if(checkBoard[0]==checkBoard[1] && checkBoard[0]==checkBoard[2])
        winner=checkBoard[0];
    else if(checkBoard[3]==checkBoard[4] && checkBoard[3]==checkBoard[5])
        winner=checkBoard[3];
    else if(checkBoard[6]==checkBoard[7] && checkBoard[6]==checkBoard[8])
        winner=checkBoard[6];
    else if(checkBoard[0]==checkBoard[3] && checkBoard[0]==checkBoard[6])
        winner=checkBoard[0];
    else if(checkBoard[1]==checkBoard[4] && checkBoard[1]==checkBoard[7])
        winner=checkBoard[1];
    else if(checkBoard[2]==checkBoard[5] && checkBoard[2]==checkBoard[8])
        winner=checkBoard[2];
    else if(checkBoard[0]==checkBoard[4] && checkBoard[0]==checkBoard[8])
        winner=checkBoard[0];
    else if(checkBoard[2]==checkBoard[4] && checkBoard[2]==checkBoard[6])
        winner=checkBoard[2];

    return winner;
}   

//Affiche sur la grille de cellules <p>
function drawBoard(){
    for(let i=1;i<=9;i++){
        document.getElementById("p"+i).innerHTML =board[i-1]==0 ? "":board[i-1];
    }
}

function log(msg){
    logMsg+=msg+"<br>";
    document.getElementById("log").innerHTML = logMsg;
}
