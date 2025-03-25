import './Transaction.css';
import card from './images/card.png';

function Transaction({ id, type, amount, status, date, time }) {
    return (
        <div className='Transaction'>
            <img src={card} alt="Card" />
            <div>
                <p className='type'>{type}</p>
                <p>Transaction ID</p>
                <p className='id'>{id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p className='amount'>${amount}</p>
                <p className='status'>{status}</p>
                <div className='timedata'>
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
            </div>
        </div>
    )
}

export default Transaction;