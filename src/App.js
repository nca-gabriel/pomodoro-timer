import { useReducer, useEffect, useRef } from "react";
import { reducer } from "./content/pomodoro.reducer";
import { Action } from "./content/pomodoro.action";
import { initialState } from "./content/pomodoro.types";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef(null);

  // Manage interval
  useEffect(() => {
    if (state.running && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: Action.TICK });
      }, 1000);
    }
    if (!state.running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.running]);

  // Format mm:ss
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div id="main">
      <h2 id="timer-label">{state.mode === "session" ? "Session" : "Break"}</h2>
      <div id="time-left">{formatTime(state.timerLeft)}</div>

      <button
        id="start_stop"
        onClick={() =>
          dispatch({ type: state.running ? Action.STOP : Action.START })
        }
      >
        {state.running ? "Stop" : "Start"}
      </button>

      <button
        id="reset"
        onClick={() => {
          const beep = document.getElementById("beep");
          if (beep) {
            beep.pause();
            beep.currentTime = 0; // rewind
          }
          dispatch({ type: Action.RESET });
        }}
      >
        Reset
      </button>

      <div>
        <h3 id="session-label">Session Length</h3>
        <button
          id="session-decrement"
          onClick={() =>
            dispatch({
              type: Action.SET_SESSION,
              payload: state.sessionLength - 1,
            })
          }
        >
          -
        </button>
        <span id="session-length">{state.sessionLength}</span>
        <button
          id="session-increment"
          onClick={() =>
            dispatch({
              type: Action.SET_SESSION,
              payload: state.sessionLength + 1,
            })
          }
        >
          +
        </button>
      </div>

      <div>
        <h3 id="break-label">Break Length</h3>
        <button
          id="break-decrement"
          onClick={() =>
            dispatch({ type: Action.SET_BREAK, payload: state.breakLength - 1 })
          }
        >
          -
        </button>
        <span id="break-length">{state.breakLength}</span>
        <button
          id="break-increment"
          onClick={() =>
            dispatch({ type: Action.SET_BREAK, payload: state.breakLength + 1 })
          }
        >
          +
        </button>
      </div>

      <audio
        id="beep"
        preload="auto"
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      />
    </div>
  );
}
export default App;
