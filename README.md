# Maze-Runner

# Live Game Demo: https://maze-runner.hudsonbirdsong.now.sh/

## Matter JS Terminology

### Definitions

    World - Object that contains all of the different 'things' in our matter app
    Engine - Reads in the current state of the world from the world object, then 
            calculates changes in positions of all the different shapes
    Runner - gets the engine and world to work together. Runs about 60 times per second.
    Render - Whenever the engine processes an update, Render will take a look at all the 
            the different shapes and show them on the screen
    Body - A shape that we are displaying. Can ge a circle, rectangle, oval, etc.
	

## Maze Game (In the browser using the Canvas API, Matter.JS )

## - Application Design Patterns - 

### Challenges
    - 1) How do I generate a maze?               
    - 2) How am I going to draw this thing on the screen?
    - 3) How do I make some keyboard keys control the ball?
    - 4) How do I detect when the ball touches the green square (aka when they win)?

### Solutions (the number corresponds with the number above)
    - 1) Many algorithms to generate a maze. I will have to learn a bit about a tree
        data structure + recursion to implement the simplest algorithm 
    - 2) Use Matter JS to draw the maze onto a canvas element (brm.io/matter-js) documentation
    - 3) Matter JS has the ability to map key presses to movements of shapes
    - 4) Matter JS has the ability to detect collisions between different shapes
        and report them to us as events

### Building a Maze
    - 1. Create a grid of 'cells'
    - 2. Pick a random starting cell
    - 3. For that cell, build a randomly-ordered list of neighbors
    - 4. If a neighbor has been visted before, remove it from the list
    - 5. For each remaining neighbor, 'move' to it and then remove the wall between those two cells
    - 6. Go back to step 3 and Repeat process (steps 3-6) for this new neighbor
	
