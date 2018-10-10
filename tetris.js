//the play area
const canvas = document.getElementById('tetris');
// the play blocks
const context = canvas.getContext('2d');
//scalling the blocks
context.scale(20,20);
//applying the background commented out in order to allow clearing
//context.fillStyle = '#000';
//context.fillRect(0,0,canvas.width, canvas.height);
//first block matrix
const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];
//the object that all the pieces are going to be saved
function createMatrix(w,h) {
    const matrix = [];
    while (h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix
}
//simplifies the draw function
function draw() {
    //applying the clear function
    context.fillStyle = '#000';
    context.fillRect(0,0,canvas.width, canvas.height);
    
    drawMatrix(player.matrix,player.pos);
}

//the drawing function
function drawMatrix(matrix, offset){
    //for each to replicate all the variables in each row.
    matrix.forEach((row,y) =>{
       //allows the loop to go down to the next line. to draw the shape
        row.forEach((value, x)=>{
            //the actual identifying of the 0 and 1 to make them red
            if(value !== 0){
                context.fillStyle='red';
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1,1);
            }
        });
    });
};
//function for all downward motion
function playerDrop(){
    player.pos.y++;
    dropCounter=0;
}

let dropCounter =0;
let dropInterval = 1000;

//allowing for incremental time
let lastTime = 0;
// this function will continuously update the game
function update(time = 0) {
    //the below const will allow for incremantal time instead of updating at random intervalls in millions of milliseconds
    const deltaTime = time - lastTime;
    lastTime=time;
    // increments the time with the variable that will directly effect position
    dropCounter+= deltaTime;
    //moves the position with the variable responsible set on time for position
    if (dropCounter > dropInterval){
        playerDrop();
    }
    //console.log(deltaTime);
    // this function is passed 
    draw();
    // allows the fram by fram animation
    requestAnimationFrame(update);

}

const arena = createMatrix(12, 20);
//console.log(arena);
//better console log for array/object
//console.table(arena);

//making the player variable DONT PUT EXTRA SPACES OR IT BREAKS
const player = {
    pos: {x: 5,y: 5},
    matrix: matrix,

}
//simple key logger
document.addEventListener('keydown', event =>{
    console.log(event)
    //key command for left
    if ( event.keyCode === 37 ){
        player.pos.x--;
    //key command for right
    }else if (event.keyCode === 39){
        player.pos.x++;
    //key command for speeding up down
    }else if (event.keyCode ===40){
        playerDrop();
    }
});

//draws the shape.

update();





