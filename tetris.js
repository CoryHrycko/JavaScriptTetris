//the play area
const canvas = document.getElementById('tetris');
// the play blocks
const context = canvas.getContext('2d')
//scalling the blocks
context.scale(20,20);
//applying the background
context.fillStyle = '#000';
context.fillRect(0,0,canvas.width, canvas.height)
//first block matrix
const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

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

const player

//draws the shape.
drawMatrix(matrix,{x: 5, y:5 });






