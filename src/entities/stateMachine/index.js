export default class StateMachine {
  constructor() {}

  createMachine = (machine, actions) => {
    this.machine = machine
    this.actions = actions
    this.currentState = machine.initial
  }

  transition = (event) => {
    if (!this.machine || !event) {
      return false
    }
    const targetState = this.machine.states[this.currentState].on?.[event.type].target
    const nextState = this.machine.states[targetState]
    if (!nextState) {
      return this.currentState
    }
    if (nextState.entry && this.actions) {
      const context = this.machine.context?.[targetState]?.[nextState.entry]
      this.actions[nextState.entry](this, context)
    }
    this.currentState = targetState
    return targetState
  }
}
