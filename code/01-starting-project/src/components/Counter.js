import { useDispatch, useSelector } from "react-redux";
import { counterActions } from "../store/counter";
import classes from "./Counter.module.css";

//changes to redux store, cause this component to be re-executed
const Counter = () => {
  // useSelector for fn component  (wrap connect for class component)
  // pass a fn to useSelector, which receives redux state, then return part of state we want to extract
  // when using useSelector - a subscription to store is automatically created
  // const counter = useSelector((state) => state.counter);
  const counter = useSelector((state) => state.counter.counter);
  const show = useSelector((state) => state.counter.showCounter);
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };

  const increaseHandler = () => {
    dispatch(counterActions.increase({ amount: 5 })); // {type: SOME_UNIQUE_IDENTIFIER, payload: 10}
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  const resetHandler = () => {
    dispatch(counterActions.reset());
  };

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggleCounter());
  };

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
      {show && <div className={classes.value}>{counter} </div>}

      <button onClick={incrementHandler}>Increment Counter</button>
      <button onClick={decrementHandler}>Decrement Counter</button>
      <button onClick={increaseHandler}>Increase by 5</button>
      <button onClick={resetHandler}>Reset Counter</button>
    </main>
  );
};

export default Counter;
