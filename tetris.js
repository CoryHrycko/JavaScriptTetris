//the play area
const canvas = document.getElementById('tetris');
// the play blocks
const context = canvas.getContext('2d');
//scalling the blocks
context.scale(20,20);

//sweep the arean in the reverse direction for the y and regulare for x
function arenaSweep() {
    let rowCount = 1;
    outer:for (let y = arena.length - 1;y > 0; --y){
        // if there is a zero it means it is not fully populated
        for (let x = 0; x < arena[y].length; ++x){
            if (arena[y][x] ===0){
                //continue outer allows to continue the correcsponding loop
                continue outer;
            }
        }
        //the defined spot where it creates the new mt row
        const row = arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score +=rowCount * 10;
        rowCount*=2;
    }

}
//applying the background commented out in order to allow clearing
//context.fillStyle = '#000';
//context.fillRect(0,0,canvas.width, canvas.height);
//first block matrix
/*const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];*///above matrix is for writting the other functions before adding the rest of the shapes
//the main collide function
function collide(arena, player){
    //assigning shorter variables
    const[m, o]=[player.matrix,player.pos];
    for(let y = 0; y<m.length;++y){
        for(let x = 0;x<m[y].length;++x){
            if (m[y][x]!==0&&
                (arena[y+o.y]&& 
                arena[y+o.y][x + o.x]) !==0){
                    return true;
                }
        }
    }
    //keep the fall going and do not reset
    return false;
}
//the object that all the pieces are going to be saved
function createMatrix(w,h) {
    const matrix = [];
    while (h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix
}
//Fun objects that are the shapes// different numbers different colors
function createPiece(type){
    if (type ==='T'){
       return[
            [0,0,0],
            [1,1,1],
            [0,1,0],
       ];
    }else if (type === 'O'){
        return[
            [2,2,2],
            [2,0,2],
            [2,2,2],
        ];
    }else if (type === 'Q'){
        return[
            [3, 3],
            [3, 3],
        ];
    }else if (type === 'L'){
        return[
            [4,0,0],
            [4,0,0],
            [4,4,4],
        ];
    }else if (type === 'J'){
        return[
            [0,0,5],
            [0,0,5],
            [5,5,5],
        ];
    }else if (type === 'I'){
        return[
            [0,0,6,0],
            [0,0,6,0],
            [0,0,6,0],
            [0,0,6,0],
        ];
    }else if (type === 'P'){
        return[
            [0,6,0,0],
            [0,6,0,0],
            [0,6,0,0],
            [0,6,0,0],
        ];
    }else if (type === 'S'){
        return[
            [0,8,8],
            [8,8,0],
            [0,0,0],
        ];
    }else if (type === 'K'){
        return[
            [8,8,0],
            [0,8,8],
            [0,0,0],
        ];
    }else if (type === 'G'){
        return[
            [7,0,0],
            [7,0,7],
            [7,7,7],
        ];
    }else if (type === 'U'){
        return[
            [9,0,9],
            [9,0,9],
            [9,9,9],
        ];
    }
}







//simplifies the draw function
function draw() {
    //applying the clear function
    context.fillStyle = '#000';
    context.fillRect(0,0,canvas.width, canvas.height);
    
    drawMatrix(arena,{x: 0, y: 0});
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
                context.fillStyle=colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1,1);
            }
        });
    });
};
//this function merges the data forms of the player and arena so that collision functions and object representation can take place.
function merge(arena,player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if (value !==0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
//function for all downward motion
function playerDrop(){
    player.pos.y++;
    //if collide move back to previous position
    if (collide(arena, player)){
        player.pos.y--;
        //merges the piece onto the areana object as a property. 
        merge(arena, player);
        //player.pos.y=0;-------replaced with player reset
        playerReset();
        // !!!!!!!!!!!!!!! debugger; important
        //allows for checking of rows and resetting new mt rows
        arenaSweep();
        updateScore();
    }
    dropCounter=0;
}
//replaces the player movement in the keydown event listener to a proper function that also checks for boarders
function playerMove(dir){
    player.pos.x += dir;
    if (collide(arena,player)){
        player.pos.x -= dir;
    }
    
}

function playerReset(){
    const pieces = 'ILJOTSKPQG';
    //math.random floored sorthand
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    //arena [0] means first row
    player.pos.x =  (arena[0].length / 2 | 0) -
                    (player.matrix[0].length / 2 | 0);
    if (collide(arena,player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }

}

//matching the rotate function with the blocks
function playerRotate(dir){
    const pos = player.pos.x
    //the offset wiggle function will allow the intialize
    let offset = 1;
    rotate(player.matrix,dir);
    //allows for a growing of wigle to get un collided
    while (collide(arena, player)){
        player.pos.x+=offset;
        offset=-(offset +(offset>0?1:-1));
        if (offset >player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x=pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for(let y=0;y<matrix.length;++y){
        for (let x = 0;x<y; ++x){
            //usually have to use a temp value to switch values
            // with this built in function we can skip that [a,b]=[b,a]
            [
                matrix[x][y],
                matrix[y][x],
            ]=[
                matrix[y][x],
                matrix[x][y],
            ];

        }
    }//the bellow code is reversing the rows. to complete the rotation. 
    if (dir > 0){
        matric.forEach(row => row.reverse());
    }else{
        matrix.reverse();
    }
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

function updateScore(){
    document.getElementById('score').innerText = player.score;
}

// the colors of the players
const colors = [
    null,
    'red',
    'blue',
    'purple',
    'green',
    'yellow',
    'orange',
    'magenta',
    'cyan',
    'white',
];


const arena = createMatrix(12, 20);
//console.log(arena);
//better console log for array/object
//console.table(arena);

//making the player variable DONT PUT EXTRA SPACES OR IT BREAKS
const player = {
    pos: {x: 0,y: 0},
    //matrix: createPiece('T'),
    matrix: null,
    score: 0,

}
//simple key logger
document.addEventListener('keydown', event =>{
    console.log(event)

    //key command for left
    if ( event.keyCode === 37 ){
       // player.pos.x--;
        playerMove(-1)
    //key command for right
    }else if (event.keyCode === 39){
        //player.pos.x++;
        playerMove(1)
    //key command for speeding up down
    }else if (event.keyCode ===40){
        playerDrop();
    //rotates left    
    }else if ( event.keyCode === 81){
        playerRotate(-1);
    //rotates right    
    }else if ( event.keyCode === 87){
        playerRotate(1);
    }
});

//draws the shape.


playerReset();
updateScore();
update();





