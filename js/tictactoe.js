/**
 * Created by mconsoni on 3/20/17.
 */

var grid = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ]

var players =  [ 'fa-times', 'fa-circle-o' ];
var curPlayer = 0;
var finishGame = false;
var player2PC = true;

var wins = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
var prefMoves = [ 4, 0, 2, 6, 8, 1, 3, 5, 7 ];

function newGame() {
    grid = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ]
    curPlayer = 0;
    finishGame = false;

    player2PC = false;
    if ($('#player2').val() === 'pc')
        player2PC = true;

    cleanGrid();

    if ($('#start').val() === 'p2') {
        curPlayer = 1;
        if (player2PC)
            makeMove();
    }

    updateTurn();
}

function click(id) {
    var pos = id.substring(1);
    // Check value of pos because an event is triggered without target.id
    if (!finishGame && parseInt(pos) >= 0 && grid[pos] === undefined) {
        move(pos);
        if (!finishGame) {
            if (player2PC)
                makeMove();
        }
    }
}

function nextPlayer() {
    curPlayer = (curPlayer == 0) ? 1 : 0;
    updateTurn();
}

function move(pos) {
    grid[pos] = curPlayer;
    $('#p' + pos).html('<i class="fa ' + players[curPlayer] + '"></i>');
    checkWin();
    checkFinish();
    if (!finishGame)
        nextPlayer();
}

function nextWin2(row, Grid) {
    var p1 = row[0];
    var p2 = row[1];
    var p3 = row[2];
    if (Grid[p1] === undefined && Grid[p2] !== undefined && Grid[p2] == Grid[p3])
        return (p1)
    if (Grid[p2] === undefined && Grid[p1] !== undefined && Grid[p1] == Grid[p3])
        return (p2)
    if (Grid[p3] === undefined && Grid[p1] !== undefined && Grid[p1] == Grid[p2])
        return (p3);
    return undefined;
}

function nextWin1(row) {
    var p1 = row[0];
    var p2 = row[1];
    var p3 = row[2];
    if (grid[p1] === undefined && grid[p2] === undefined && grid[p3] === 1)
        return [ p1, p2 ];
    if (grid[p1] === undefined && grid[p2] === 1 && grid[p3] === undefined)
        return [ p1, p3 ];
    if (grid[p1] === 1 && grid[p2] === undefined && grid[p3] === undefined)
        return [ p2, p3 ];
    return undefined;
}

function makeMove() {
    // See if I can win or if User is gonna win.
    var nextmove1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var nextmove2 = undefined;
    for (c in wins) {
        var win = wins[c];

        if (nextmove2 != undefined)
            break;
        nextmove2 = nextWin2(win, grid);

        var n1 = nextWin1(win);
        if (n1 != undefined) {
            nextmove1[n1[0]] = nextmove1[n1[0]] + 1;
            nextmove1[n1[1]] = nextmove1[n1[1]] + 1;
        }

    }

    if (nextmove2 !== undefined)
        return move(nextmove2);

    var max = 0;
    var maxPos = undefined;
    for (var c = 0; c < 9; c++) {
        if (nextmove1[c] > max) {
            max = nextmove1[c];
            maxPos = c;
        }
    }
    if (maxPos !== undefined)
        return move(maxPos);

    for (var c = 0; c < 9; c++)
        if (grid[prefMoves[c]] === undefined)
            return move(prefMoves[c]);
}

function checkFinish() {
    for (var c = 0; c < 9; c++)
        if (grid[c] == undefined)
            return;
    finishGame = true;
    finish();
}

function checkWin() {
    for (c in wins) {
        var win = wins[c];
        if (grid[win[0]] != undefined && grid[win[0]] == grid[win[1]] && grid[win[1]] == grid[win[2]]) {
            playerWin();
            finishGame = true;
            break;
        }
    }
}

function cleanGrid() {
    for (var c = 0; c < 9; c++)
        $('#p' + c).html('');
}

function updateMsg(msg) {
    $('#msg').html(msg);
}
function finish() {
    updateMsg('DRAW!!!');
}
function playerWin(p) {
    updateMsg('<i class="fa ' + players[curPlayer] + '"></i> PLAYER ' + (curPlayer+1).toString() + " WINS!!!");
}
function updateTurn() {
    updateMsg('<i class="fa ' + players[curPlayer] + '"></i> PLAYER ' + (curPlayer+1).toString() + "'S TURN");
}

$(document).ready(() => {
    for (var c = 0; c < 9; c++)
        $('#p' + c).click((e) => { click(e.target.id); });
});
