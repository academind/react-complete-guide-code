import Todo from './components/Todo';
import Modal from './components/Modal';
import Backdrop from './components/Backdrop';

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <Todo text='Learn React' />
      <Todo text='Master React' />
      <Todo text='Explore the full React course' />
      <Modal />
      <Backdrop />
    </div>
  );
}

export default App;
