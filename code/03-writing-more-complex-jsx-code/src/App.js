import Expenses from './components/Expenses';
import { expenses } from './components/expensesData';


function App() {
  return (
    <div>
    <Expenses expenses={expenses} />
    </div>
  );
}

export default App;
