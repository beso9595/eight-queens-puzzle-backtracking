/*
    beso9595 - 07.06.16
*/

var board;                          //for examining "backtracking" function
var results;                        //for keeping results
var cols;                           //number of columns you want to display results in
var firstColor = "#FFCE9E";         //first color of board
var secondColor = "#D18B47";        //second color of board


//main function
function calculate() {
    clearAll();
    initBoard();
    backtracking(0);
    print();
}

//clears variables, in case of pressing "solve" button more then one time
function clearAll() {
    board = [];
    results = [];
    cols = 4;
    //
    toggle(false);
    setResultsCount("");
    //
    var resultsTable = document.getElementById("results");
    while (resultsTable.hasChildNodes()) {
        resultsTable.removeChild(resultsTable.firstChild);
    }
}

//shows and hides "solution" div
function toggle(showHide) {
    var solutionDiv = document.getElementById("solution");
    solutionDiv.style.display = showHide ? 'block' : 'none';
}

//sets results quantity/content in html
function setResultsCount(num) {
    document.getElementById("resultsCount").innerText = num;
}

//initializes board global variable
function initBoard() {
    for (var i = 0; i < 8; i++) {
        board.push([false, false, false, false, false, false, false, false]);
    }
}

//compares two positions if they share same row, column or diagonal
function compare(x1, y1, x2, y2) {
    return !(x1 == x2 || y1 == y2 || (Math.abs(x2 - x1) == Math.abs(y2 - y1)));
}

//gets the array of positions of all queens on the board
function getQueens() {
    var queensList = [];
    var queenPos;
    var found;
    for (var i = 0; i < board.length; i++) {
        queenPos = createQueen(-1, -1);
        found = false;
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j]) {
                queenPos.row = i;
                queenPos.col = j;
                found = true;
                break;
            }
        }
        if (found) {
            queensList.push(queenPos);
        }
    }
    return queensList;
}

//creates object of queen
function createQueen(rowInd, colInd) {
    return { row: rowInd, col: colInd };
}

//check given board position for every queen on the board
function check(rowInd, colInd) {
    var queensList = getQueens();
    for (var i = 0; i < queensList.length; i++) {
        if (!compare(queensList[i].row, queensList[i].col, rowInd, colInd)) {
            return false;
        }
    }
    return true;
}

//main function of calculation results with recursion
function backtracking(rowInd){
    if (rowInd == board.length) {
        return true;
    }
    //
    for (var i = 0; i < board.length; i++) {
        if (check(rowInd, i)) {
            board[rowInd][i] = true;
            if (backtracking(rowInd + 1)) {
                save();
            }
            board[rowInd][i] = false;
        }
    }
    return false;
}

//saves the current board into new board array and adds it to results
function save() {
    var newBoard = [];
    newBoard.length = 8;
    for (var i = 0; i < newBoard.length; i++) {
        newBoard[i] = [];
        newBoard[i].length = 8;
    }
    //
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            newBoard[i][j] = board[i][j];
        }
    }
    results.push(newBoard);
}

//builds a new board with given array
function builder(boardArr, ind) {
    var TABLE = document.createElement("TABLE");
    var tableAtt = document.createAttribute("class");
    tableAtt.value = "board";
    TABLE.setAttributeNode(tableAtt);
    for (var i = 0; i < 8; i++) {
        var TR = document.createElement("TR");
        for (var j = 0; j < 8; j++) {
            var TD = document.createElement("TD");
            TD.style.cssText = "background-color: " + (((i + j) % 2 == 0) ? firstColor : secondColor) + ";";
            var IMG = document.createElement("IMG");
            var imgAtt = document.createAttribute("src");
            imgAtt.value = "img/" + (boardArr[i][j] ? "Q" : "E") + ".png";
            IMG.setAttributeNode(imgAtt);
            TD.appendChild(IMG);
            TR.appendChild(TD);
        }
        TABLE.appendChild(TR);
    }
    //
    var resultsOb = document.getElementById("results");
    var newLine = (ind % cols == 0);
    var newBoardTR = document.createElement("TR");
    var newBoardTD = document.createElement("TD");
    //
    newBoardTD.appendChild(TABLE);
    newBoardTR.appendChild(newBoardTD);
    //
    var addToOb = newLine ? resultsOb : resultsOb.lastElementChild;
    var newBoard = newLine ? newBoardTR : newBoardTD;
    //
    addToOb.appendChild(newBoard);
}

//shows and hides results, prints boards and sets quantity of results
function print() {
    toggle(true);
    //
    for (var i = 0; i < results.length; i++) {
        builder(results[i], i);
    }
    //
    setResultsCount(results.length);
}