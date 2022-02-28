import ExpenseDate from './ExpenseDate';
import Card from '../UI/Card';
import './ExpenseItem.css';

// 매개변수로는 props를 명시해서 객체로 받아올 수 있음을 명시한다.
const ExpenseItem = (props) => {
  return (
    // 하나의 return 명령 (혹은 JSX 코드) 당 하나의 루트 elem을 가져야 한다.
    // 해결책 : 하나의 커다란 div로 감싸거나 ()로 감싸는 등으로 해결할 수 있다.
    <Card className="expense-item">
      <ExpenseDate date={props.date} month={props.month} title={props.title} />
      {/* HTML (class)과는 달리 className을 사용한다. */}
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <div className="expense-item__price">{props.amount}</div>
      </div>
    </Card>
  );
};

export default ExpenseItem;
