// Destructuring the object Matter aka Pulling out specific objects themselves (on the Matter object)
// listed below so we don't have to access them like this anymore: Matter.Engine.create() 
// but can use Engine.create() now, this is much cleaner.
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// Global config variables
const cellsHorizontal = 16;
const cellsVertical = 16;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

// Matter Boilerplate code // 

// Creates a new engine, and then assigning it to a variable engine
const engine = Engine.create();

// Diabling gravity in our world
engine.world.gravity.y = 0;

// Destructuring (I am getting) a world object from the newly created engine
const { world } = engine;

// Create the render object, this is what will show some content on the screen.
// Or in other words, go and render the representation of the world inside the 
// document.body 
const render = Render.create({
    // specify where to render the canvas on the screen. document.body is where we chose to show it
    element: document.body,
    //specify what engine to use
    engine: engine,
    // pass in an options object
    options: {
        // TOGGLE THE WIREFRAMES ON AND OFF with comments, FOR COLOR / NO COLOR
        wireframes: false,
        width,
        height
    }
});
// Tell the render object to start working by passing in the newly created render
Render.run(render);
// Runner - gets the engine and world to work together.
Runner.run(Runner.create(), engine);

// END of Matter Boilerplate code // 

// Creating the Walls (shapes)
const walls = [
    // first number = distance from top-left coordinate to the center of that rectangle
    // second number = how many units down from that top-left corner
    // third number = total width of that rectangle
    // forth number = height of that rectangle
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),          //top wall
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),     //bottom wall
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),        //left wall
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })     //right wall
];
// Adding the walls into the world
World.add(world, walls);

// MAZE/GRID GENERATION

const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
};


// Here's a better way to generate the maze/grid

// This creates an array of length 3, fills it with null to begin. Then we use map function
// and for each element we create another array of length 3 and fill it with the value false.
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

// console.log(horizontals);

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughMaze = (row, column) => {
    // If i have visted the cell at [row, column], then return
    if (grid[row][column] === true) {
        return;
    }

    // Mark this cell as being visisted
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors that are all around the current cell we're in
    const neighbors = shuffle([
        [row - 1, column, 'up'],  //above neighbor
        [row, column + 1, 'right'],  //right neighbor
        [row + 1, column, 'down'],  //bottom neighbor
        [row, column - 1, 'left']  //left neighbor
    ]);

    // For each neighbor...
    for (let neighbor of neighbors) {
        //destructuring from neighbors array
        const [nextRow, nextColumn, direction] = neighbor;

        // See if that neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }

        // If we have visited that neighbor, continue to the next neighbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // Remove a wall from either horizontals or verticals
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        stepThroughMaze(nextRow, nextColumn);
    }


    // Visit that next cell
};

stepThroughMaze(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open === true) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    });
});


// Added in the GOAL
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        label: 'goal',
        isStatic: true,
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);

// Added in the BALL
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;

const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'blue'
        }
    }
);
World.add(world, ball);

document.addEventListener('keydown', eventObject => {
    const { x, y } = ball.velocity;

    // key press w
    if (eventObject.keyCode === 87) {
        Body.setVelocity(ball, { x: x, y: y - 5 });
    }

    //key press d
    if (eventObject.keyCode === 68) {
        Body.setVelocity(ball, { x: x + 5, y: y });

    }

    // key press s
    if (eventObject.keyCode === 83) {
        Body.setVelocity(ball, { x: x, y: y + 5 });
    }

    // key press a
    if (eventObject.keyCode === 65) {
        Body.setVelocity(ball, { x: x - 5, y: y });
    }
});

// Win condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            document.querySelector('.winner').classList.remove('hidden');

            // if they win lets turn gravity back on, and make the walls collapse
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});