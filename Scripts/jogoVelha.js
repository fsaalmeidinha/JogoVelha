var game;
var currentPlayer = 0;
var lastFirstPlayer = 0;
var newGame = true;
var firstGame = true;

$(document).ready(function () {
    startNewGame();
});

function getRandomCellPosition() {
    var min = 0;
    var max = 2;
    var randomX = Math.floor(Math.random() * (max - min + 1)) + min;
    var randomY = Math.floor(Math.random() * (max - min + 1)) + min

    return { x: randomX, y: randomY };
}

function jvCellClicked() {
    newGame = false;
    var cellPosition = getCellPosition(this);
    var gameIndex = getGameIndexFromCellPosition(cellPosition);
    chooseCell(this, gameIndex);
    if (!newGame) {
        switchPlayer();
    }
    checkIfIAPlays();
}

function switchPlayer() {
    currentPlayer = getNextPlayer(currentPlayer);
}

function getNextPlayer(playerNumber) {
    if (playerNumber == 0)
        return 1;
    else
        return 0;
}

function getCellPosition(cell) {
    var splitedId = cell.id.split('_');
    var posicao = { x: parseInt(splitedId[0][2]), y: parseInt(splitedId[1]) };
    return posicao;
}

function chooseCell(cell, gameIndex) {
    game[gameIndex] = currentPlayer;
    $(cell).unbind("click");

    if (currentPlayer == 0)
        $(cell).addClass('firstPlayerCell');
    else
        $(cell).addClass('secondPlayerCell');

    checkGameStatus();
}

function startNewGame() {
    $('#jogoVelha div').unbind("click");
    $('#jogoVelha div').click(jvCellClicked);
    $('#jogoVelha div').removeClass('firstPlayerCell').removeClass('secondPlayerCell');
    game = [null, null, null, null, null, null, null, null, null];
    
    lastFirstPlayer = getNextPlayer(lastFirstPlayer);
    currentPlayer = lastFirstPlayer;
    newGame = true;
    if (firstGame) {
        checkIfIAPlays();
        firstGame = false;
    }
}

function checkGameStatus() {
    var winner = checkForWinner(game);
    if (winner == null) {
        if (checkForTiedGame(game)) {
            alert('o jogo empatou!');
            somarUmAoPlacar('spanEmpates');
            startNewGame();
        }
    }
    else {
        if (winner == 0) {
            alert('Parabéns, você ganhou!');
            somarUmAoPlacar('spanVitorias');
        }
        else {
            alert('Você perdeu. Tente novamente!');
            somarUmAoPlacar('spanDerrotas');
        }
        startNewGame();
    }
}

function checkForWinner(currentGame) {
    var winnerChecks = ["checkAxisWinner(currentGame, 'horizontal')", "checkAxisWinner(currentGame, 'vertical')", "checkDiagonalWinner(currentGame)"];
    var winner = null;

    for (var winnerCheckIndex = 0; winnerCheckIndex < winnerChecks.length && winner == null; winnerCheckIndex++) {
        winner = eval(winnerChecks[winnerCheckIndex]);
    }

    return winner;
}

function checkAxisWinner(currentGame, axis) {
    for (var firstAxisIndex = 0; firstAxisIndex < 3; firstAxisIndex++) {
        var cellsOwners = [];
        for (var secondAxisIndex = 0; secondAxisIndex < 3; secondAxisIndex++) {
            if (axis == 'horizontal')
                cellsOwners.push(checkForCellPlayerOwner(currentGame, { x: secondAxisIndex, y: firstAxisIndex }));
            else
                cellsOwners.push(checkForCellPlayerOwner(currentGame, { x: firstAxisIndex, y: secondAxisIndex }));
        }

        var winner = checkForWinnerInCellsOwnersArray(cellsOwners);
        if (winner != null) {
            return winner;
        }
    }

    return null;
}

function checkDiagonalWinner(currentGame) {
    var mainDiagonalCellsOwners = [];
    var secondaryDiagonalCellsOwners = [];
    for (var indice = 0; indice < 3; indice++) {
        var mainCellPosition = { x: 2 - indice, y: indice };
        mainDiagonalCellsOwners.push(checkForCellPlayerOwner(currentGame, mainCellPosition));
        var secondaryCellPosition = { x: indice, y: indice };
        secondaryDiagonalCellsOwners.push(checkForCellPlayerOwner(currentGame, secondaryCellPosition));

        var mainDiagonalWinner = checkForWinnerInCellsOwnersArray(mainDiagonalCellsOwners);
        if (mainDiagonalWinner != null)
            return mainDiagonalWinner;

        var secondaryDiagonalWinner = checkForWinnerInCellsOwnersArray(secondaryDiagonalCellsOwners);
        if (secondaryDiagonalWinner != null)
            return secondaryDiagonalWinner;
    }

    return null;
}

function checkForWinnerInCellsOwnersArray(cellsOwners) {
    var sameOwnerAndNotNull = cellsOwners[0] != null && cellsOwners[0] == cellsOwners[1] && cellsOwners[1] == cellsOwners[2];

    if (sameOwnerAndNotNull) {
        return cellsOwners[0];
    }

    return null;
}

function checkForCellPlayerOwner(currentGame, cellPosition) {
    var gameIndex = getGameIndexFromCellPosition(cellPosition);
    var playerOwner = currentGame[gameIndex];
    return playerOwner;
}

function checkForTiedGame(currentGame) {
    var emptyCells = $.grep(currentGame, function (cell) { return cell == null; });
    var tiedGame = emptyCells.length == 0;

    return tiedGame;
}

function getGameIndexFromCellPosition(cellPosition) {
    var gameIndex = cellPosition.x + cellPosition.y * 3;
    return gameIndex;
}

function getCellPositionFromGameIndex(gameIndex) {
    var cellPosition = { x: gameIndex % 3, y: parseInt(gameIndex / 3) };
    return cellPosition;
}

function getCellFromPosition(cellPosition) {
    var cell = $('#jv' + cellPosition.x + '_' + cellPosition.y);
    return cell;
}

function somarUmAoPlacar(idSpanPlacar) {
    var spanPlacar = $('#' + idSpanPlacar);
    var valorAtual = parseInt($(spanPlacar).text(spanPlacar.innerHTML));
    $(spanPlacar).text(valorAtual + 1);
}
