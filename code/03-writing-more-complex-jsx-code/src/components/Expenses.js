import ExpenseItem from "./ExpenseItem"

export default function Expenses({expenses}) {
    return expenses.map(e=> <ExpenseItem {...e}/>)
}
