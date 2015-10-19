function checkIfIAPlays() {
    if (currentPlayer == 1) {
        var cellToPlay = getNextPlay();
        cellToPlay.click();
    }
}

function getNextPlay() {
    var cellPosition = null;

    if (newGame) {
        cellPosition = getRandomCellPosition();
    } else {
        var possibleGames = getPossibleGames({ game: game }, currentPlayer);
        var nextGameState = chooseNextPlay(possibleGames);
        cellPosition = getCellPositionFromNextGameState(nextGameState.game);
    }

    var cellToPlay = getCellFromPosition(cellPosition);

    return cellToPlay;
}

function getCellPositionFromNextGameState(nextGameState) {
    var cellPosition = null;
    for (var gamePlayIndex = 0; gamePlayIndex < nextGameState.length; gamePlayIndex++) {
        if (game[gamePlayIndex] != nextGameState[gamePlayIndex]) {
            cellPosition = getCellPositionFromGameIndex(gamePlayIndex);
        }
    }
    return cellPosition;
}

function chooseNextPlay(possibleGames) {
    var bestGame = possibleGames[0];
    for (var gameIndex = 1; gameIndex < possibleGames.length; gameIndex++) {
        bestGame = getBestGame(bestGame, possibleGames[gameIndex]);
    }
    return bestGame;
}

function getBestGame(game1, game2) {
    if (game1.status == null) {
        var bestChildGame = chooseNextPlay(game1.possibleGames);
        game1.status = bestChildGame.status;
    }
    if (game2.status == null) {
        var bestChildGame = chooseNextPlay(game2.possibleGames);
        game2.status = bestChildGame.status;
    }

    if (game1.player == currentPlayer) {
        if (game1.status == 'win')
            return game1;
        else if (game2.status == 'win')
            return game2;
    }
    else {
        if (game1.status == 'loose')
            return game1;
        else if (game2.status == 'loose')
            return game2;
    }

    if (game1.status == 'tie')
        return game1;
    else
        return game2;
}

var pg = 0;

function getPossibleGames(currentGame, playerNumber) {
    var possibleGames = [];
    for (var gamePlayIndex = 0; gamePlayIndex < currentGame.game.length; gamePlayIndex++) {
        if (currentGame.game[gamePlayIndex] == null) {
            pg = pg + 1;
            var possibleGame = { game: cloneGame(currentGame.game), player: playerNumber, status: null };
            possibleGame.game[gamePlayIndex] = playerNumber;
            possibleGames.push(possibleGame);

            if (!setGameWinnerOrTieIfExists(possibleGame)) {
                possibleGame.possibleGames = getPossibleGames(possibleGame, getNextPlayer(playerNumber));
            }
        }
    }

    return possibleGames;
}

function setGameWinnerOrTieIfExists(currentGame) {
    var winner = checkForWinner(currentGame.game);
    if (winner != null) {
        if (winner == currentPlayer) {
            currentGame.status = 'win';
        }
        else {
            currentGame.status = 'loose';
        }
    }
    else {
        if (checkForTiedGame(currentGame.game)) {
            currentGame.status = 'tie';
        }
    }

    var endOfGame = currentGame.status != null;
    return endOfGame;
}

function cloneGame(gameToClone) {
    return $(gameToClone).slice(0);
}