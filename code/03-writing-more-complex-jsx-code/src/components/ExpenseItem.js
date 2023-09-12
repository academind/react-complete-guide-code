import './ExpenseItem.css';

function ExpenseItem({id, title, amount, date}) {
  const date2 = date.toString();
  return (
    <div className='expense-item' key={id}>
      <div>{date2}</div>
      <div>
        <h2>{title}</h2>
        <div className='.expense-item__price'>{amount}</div>
      </div>
    </div>
  );
}

export default ExpenseItem;
