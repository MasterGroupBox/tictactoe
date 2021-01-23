// Au click lancer fonction selon le mode sélectionné parmi 3 modes
// Uncomment de mode that you'd like to run
for(let i=1; i<=9; i++){
    //Mode 1 : 2 joueurs
        // document.getElementById("p"+i).addEventListener("click",function(){xo(i-1)});
    
    //Mode 2 : AI imbattable | Pas encore au point
        document.getElementById("p"+i).addEventListener("click",function(){play(i)});
    
    //Mode 3 : AI aléatoire facile
        //document.getElementById("p"+i).addEventListener("click",function(){playRandom(i);});
}

//Boutton Reset
document.getElementById("button").addEventListener("click", function(){
    reset();
})

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
        alert("Draw game ...");
        reset();
    }
}

//Remettre la matrice à zero et la dessiner sur HTML
function reset(){
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
    if(board[i-1]!=0)
        return;
    
    board[i-1]="X";
    /*setTimeout(function(){
        alert("p");
    },1000);*/
    displayWinner();
    
    let winner = checkWinner(board);

    log(playablePositions(board).join(" - "));
    if(winner == 0){
        let run = mm(board,"O");
        board[run.position]="O";
        log(run.position);
    }
    log(playablePositions(board).join(" - "));
    drawBoard();
    displayWinner();
}

// Fonction récursive minimax
const mm = (checkBoard, player) => {
    let results = [];
    let winner = checkWinner(checkBoard);
    let playable = playablePositions(checkBoard);
    let workBoard = [...checkBoard]; // ERROR 2 FIXED : make a copy of checkboard so it doesn't get altered (by value not by ref)

    console.log("Minimax | Size : "+playable.length);
    //Condition de fin - ERROR 1 FIXED : return object {position:0,score:10} instead of only the value of the score (10)

    if(winner == "O")
        return {position:0,score:10};
    else if(winner == "X")
        return {position:0,score:-10};
    else if(playable.length==0)
        return {position:0,score:0};


    //Sinon, calculer le score de chaque case vide par appel de minimax
    for(let i=0;i<playable.length;i++){
        workBoard[playable[i]]=player;
        console.log("Playable of workboard = "+playablePositions(workBoard).length);
        // log("Testing position "+playable[i]+" for "+player);
        results.push({position:playable[i],score:mm(workBoard, otherPlayer(player)).score}); // ERROR 3 FIXED : position:playable[i] instead of position:i
        workBoard[playable[i]]=0;
    }

    //Aprés avoir collecté les scores, retourner le min si c'est le tour de l'humain sinon le max
    if(player == "X")
        return min(results);
    else
        return max(results);
}

function min(results){
    let min = results[0];

    for(let i=0;i<results.length;i++)
        if(results[i].score < min.score)
            min = results[i];
    
    log(results.map((item)=>item.score).join(" * ") + " | min = "+min.score);
    return min;
}

function max(results){
    let max = results[0];
    
    for(let i=0;i<results.length;i++)
    if(results[i].score > max.score)
    max = results[i];
    
    log(results.map((item)=>item.score).join(" * ") + " | max = "+max.score);
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
    if(checkBoard[0]==checkBoard[1] && checkBoard[0]==checkBoard[2] && checkBoard[0]!=0)
        winner=checkBoard[0];
    else if(checkBoard[3]==checkBoard[4] && checkBoard[3]==checkBoard[5] && checkBoard[3]!=0)
        winner=checkBoard[3];
    else if(checkBoard[6]==checkBoard[7] && checkBoard[6]==checkBoard[8] && checkBoard[6]!=0)
        winner=checkBoard[6];
    else if(checkBoard[0]==checkBoard[3] && checkBoard[0]==checkBoard[6] && checkBoard[0]!=0)
        winner=checkBoard[0];
    else if(checkBoard[1]==checkBoard[4] && checkBoard[1]==checkBoard[7] && checkBoard[1]!=0)
        winner=checkBoard[1];
    else if(checkBoard[2]==checkBoard[5] && checkBoard[2]==checkBoard[8] && checkBoard[2]!=0)
        winner=checkBoard[2];
    else if(checkBoard[0]==checkBoard[4] && checkBoard[0]==checkBoard[8] && checkBoard[0]!=0)
        winner=checkBoard[0];
    else if(checkBoard[2]==checkBoard[4] && checkBoard[2]==checkBoard[6] && checkBoard[2]!=0)
        winner=checkBoard[2];

    return winner;
}   

//Affiche sur la grille de cellules <p>
function drawBoard(){
    for(let i=1;i<=9;i++){
        document.getElementById("p"+i).innerHTML = board[i-1]==0 ? "":board[i-1];
    }
}

function log(msg){
    logMsg+=msg+"<br>";
    document.getElementById("log").innerHTML = logMsg;
}