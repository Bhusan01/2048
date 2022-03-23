import Grid from "./Grid.js";
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board");


const grid = new Grid(gameBoard);


grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput()


function setupInput() {
    window.addEventListener("keydown", handleInput, {once: true})

}



async function handleInput(e){
    switch (e.key) {
        case "ArrowUp":
            if(!canMoveUp()){
                setupInput()
                return
            }
            await moveUp()
            break
            case "ArrowDown":
            if(!canMoveDown()){
                setupInput()
                return
            }
            await moveDown()
            break
            case "ArrowLeft":
            if(!canMoveLeft()){
                setupInput()
                return
            }    
            await moveLeft()
            break
            case "ArrowRight":
            if(!canMoveRight()){
                setupInput()
                return
            }
            await moveRight()
            break
        default: 
            setupInput()
            return
    }


    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile


    if(!canMoveDown && !canMoveLeft &&  !canMoveRight && !canMoveUp){
        newTile.waitForTransition(true).then(() => {
            alert("you lose")
        })
    }else{
        setupInput()
    }

    setupInput()
}





function moveUp() {
    return slideTiles(grid.cellsByColumn)
}
function moveLeft() {
    return slideTiles(grid.cellsByRows)
}
function moveRight() {
    return slideTiles(grid.cellsByRows.map(row => [...row].reverse()))
}
function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(group => {
        const promises = []
        for (let i = 1; i < group.length; i++) {
            const cell = group[i]
            if(cell.tile == null) continue
            let lastValidCell;
            for (let h = i -1; h>= 0; h-- ) {
                const movetoCell = group[h]
                if(!movetoCell.canAccept(cell.tile)) break

                lastValidCell = movetoCell
            }

            if(lastValidCell != null) {
                promises.push(cell.tile.waitForTransition())
                if(lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile
                }else{
                    lastValidCell.tile = cell.tile
                }

                cell.tile = null;
            }
        }
        return promises
    }))
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown(){
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft(){
    return canMove(grid.cellsByRows)
}
function canMoveRight(){
    return canMove(grid.cellsByRows.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) =>{
            if(index === 0) return false
            if (cell.tile == null) return false
            const movetoCell = group[index -1]
            return movetoCell.canAccept(cell.tile)
        })
    })
}