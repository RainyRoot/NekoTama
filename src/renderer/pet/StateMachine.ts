export type PetState =
  | 'idle'
  | 'walking'
  | 'eating'
  | 'sleeping'
  | 'excited'
  | 'sad'
  | 'panicking';

export interface StateTransition {
  from: PetState;
  to: PetState;
  condition: () => boolean;
}

export class StateMachine {
  private current: PetState = 'idle';
  private transitions: StateTransition[] = [];
  private listeners: Map<PetState, Array<() => void>> = new Map();

  constructor() {
    this.setupDefaultTransitions();
  }

  private setupDefaultTransitions(): void {
    // Transitions are evaluated in order — first match wins
    this.transitions = [
      // Idle → walking randomly while healthy
      {
        from: 'idle',
        to: 'walking',
        condition: () => Math.random() < 0.1, // 10% chance per tick
      },
      // Walking → idle after a while (handled by timer in PetCanvas)
      {
        from: 'walking',
        to: 'idle',
        condition: () => Math.random() < 0.05,
      },
    ];
  }

  get state(): PetState {
    return this.current;
  }

  /** Force a transition regardless of conditions (used by system events) */
  forceTransition(to: PetState): void {
    this.setState(to);
  }

  /** Evaluate all transitions from current state; returns true if state changed */
  tick(): boolean {
    for (const t of this.transitions) {
      if (t.from === this.current && t.condition()) {
        this.setState(t.to);
        return true;
      }
    }
    return false;
  }

  onEnter(state: PetState, callback: () => void): void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, []);
    }
    this.listeners.get(state)!.push(callback);
  }

  private setState(next: PetState): void {
    if (next === this.current) return;
    this.current = next;
    const callbacks = this.listeners.get(next) ?? [];
    callbacks.forEach((cb) => cb());
  }
}
