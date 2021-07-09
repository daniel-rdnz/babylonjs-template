export const keyBoard = { UP: 38, RIGHT: 39, LEFT: 37, DOWN: 40, W: 87, D: 68, A: 65, S: 83, SPACE: 32 }
export const actions = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' }
export const keyActionMap = {
    [keyBoard.UP]: actions.UP,
    [keyBoard.DOWN]: actions.DOWN,
    [keyBoard.LEFT]: actions.LEFT,
    [keyBoard.RIGHT]: actions.RIGHT,
    [keyBoard.W]: actions.UP,
    [keyBoard.S]: actions.DOWN,
    [keyBoard.A]: actions.LEFT,
    [keyBoard.D]: actions.RIGHT
  }
