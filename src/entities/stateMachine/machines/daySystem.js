export const machine = {
  id: 'daySystem',
  initial: 'startCycle',
  context: {
    day: {
      waitTo: { time: 2 }
    },
    night: {
      waitTo: { time: 1 }
    }
  },
  states: {
    startCycle: {
      on: {
        BEGIN: {
          target: 'day'
        }
      }
    },
    day: {
      on: {
        END: {
          target: 'sunSet'
        }
      },
      entry: 'waitTo'
    },
    sunSet: {
      on: {
        END: {
          target: 'night'
        }
      }
    },
    night: {
      on: {
        END: {
          target: 'sunDawn'
        }
      },
      entry: 'waitTo'
    },
    sunDawn: {
      on: {
        END: {
          target: 'day'
        }
      }
    }
  }
}

export const actions = {
  waitTo: (machine, { time }) => {
    setTimeout(() => {
      machine.transition({ type: 'END' })
    }, time * 60 * 1000)
  }
}
