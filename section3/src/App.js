import Expenses from './components/Expenses/Expenses';
// 소문자로 시작하는 elem : HTML. 대문자로 시작하는 elem : 리액트
const App = () => {
  const expenses = [
    {
      id: 'e1',
      title: 'Car Insurance',
      amount: 294.67,
      date: new Date(2021, 2, 28),
    },
    {
      id: 'e2',
      title: 'Toilet Paper',
      amount: 94.12,
      date: new Date(2021, 2, 12),
    },
    { id: 'e3', title: 'Mac', amount: 2000.0, date: new Date(2022, 2, 28) },
    { id: 'e4', title: 'PS5', amount: 1500.0, date: new Date(2022, 2, 25) },
  ];
  return (
    <div>
      <h2>Let's get started!</h2>
      <Expenses items={expenses} />
    </div>
  );
};

export default App;
