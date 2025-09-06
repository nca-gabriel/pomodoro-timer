import { Action } from "./pomodoro.action";
import { initialState } from "./pomodoro.types";

export function reducer(state, action) {
  switch (action.type) {
    case Action.START:
      return { ...state, running: true };
    case Action.STOP:
      return { ...state, running: false };
    case Action.RESET: {
      const beep = document.getElementById("beep");
      if (beep) {
        beep.pause();
        beep.currentTime = 0;
      }
      return { ...initialState };
    }
    case Action.TICK: {
      if (state.timerLeft > 0) {
        return { ...state, timerLeft: state.timerLeft - 1 };
      } else {
        // play beep
        const beep = document.getElementById("beep");
        if (beep) beep.play();

        // switch mode
        if (state.mode === "session") {
          return {
            ...state,
            mode: "break",
            timerLeft: state.breakLength * 60,
          };
        } else {
          return {
            ...state,
            mode: "session",
            timerLeft: state.sessionLength * 60,
          };
        }
      }
    }
    case Action.SET_SESSION:
      if (state.running) return state;
      return {
        ...state,
        sessionLength: Math.min(60, Math.max(1, action.payload)),
        timerLeft: Math.min(60, Math.max(1, action.payload)) * 60,
      };
    case Action.SET_BREAK: {
      const newLen = Math.min(60, Math.max(1, action.payload));
      return {
        ...state,
        breakLength: newLen,
        // if not running and in break mode, reset timerLeft
        ...(state.mode === "break" && !state.running
          ? { timerLeft: newLen * 60 }
          : {}),
      };
    }
    default:
      return state;
  }
}
