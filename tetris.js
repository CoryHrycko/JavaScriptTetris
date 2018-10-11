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
//Fun objects that are the shapes
function createPiece(type){
    if (type ==="T"){
       return[
            [0,0,0],
            [1,1,1],
            [0,1,0],
       ];
    }else if (type === 'O'){
        return[
            [1,1,1],
            [1,0,1],
            [1,1,1],
        ];
    }else if (type === 'O1'){
        return[
            [1, 1],
            [1, 1],
        ];
    }else if (type === 'L'){
        return[
            [1,0,0],
            [1,0,0],
            [1,1,1],
        ];
    }else if (type === 'J'){
        return[
            [0,0,1],
            [0,0,1],
            [1,1,1],
        ];
    }else if (type === 'I'){
        return[
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
        ];
    }else if (type === 'I1'){
        return[
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ];
    }else if (type === 'S'){
        return[
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ];
    }else if (type === 'K'){
        return[
            [1,1,0],
            [0,1,1],
            [0,0,0],
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
                context.fillStyle='red';
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
        player.pos.y=0;
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
    const = pieces = 'ILJOTSZO1I1';
    //math.random floored sorthand
    player.matrix=createPeice(pieces[pieces.length * Math.random() | 0]);
    player.pos.y=0;
    //arena [0] means first row
    player.pos.x=   (arena[0].length /2 | 0) -
                    (player.matrix[0])
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

const arena = createMatrix(12, 20);
//console.log(arena);
//better console log for array/object
//console.table(arena);

//making the player variable DONT PUT EXTRA SPACES OR IT BREAKS
const player = {
    pos: {x: 5,y: 5},
    matrix: createPiece('T'),

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

update();





