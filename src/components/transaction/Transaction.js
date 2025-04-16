import './Transaction.css';
import card from '../../images/card.png';
import exchange from '../../images/exchange.png';
import cardplus from '../../images/cardplus.png';
import cardminus from '../../images/cardminus.png';

function Transaction({ id, type, amount, status, date, time }) {
    // Get the styling of the status to change based on what it is
    function getStatusClass() {
        let statusClass = "";
        if (status === "Confirmed") {
            statusClass = "confirmed";
        } else if (status === "Pending") {
            statusClass = "pending";
        } else {
            statusClass = "denied";
        }
        return statusClass;
    }

    function getTypeImg() {
        if (type === "Refund" || type === "Cashback") {
            return cardplus;
        } else if (type === "Payment") {
            return cardminus;
        } else if (type === "Currency Exchange") {
            return exchange;
        }
        return card; // default case
    }


    return (
        <div className='Transaction'>
            <img src={getTypeImg()} alt="Card" />
            <div className='container1'>
                <p className='type'>{type}</p>
                <p>Transaction ID:</p>
                <p className='id'>{id}</p>
            </div>
            <div className='container2' style={{ textAlign: 'right' }}>
                <p className='amount'>${amount}</p>
                <p className={getStatusClass()}>{status}</p>
                <div className='timedata'>
                    <p>{date}</p>
                    <p>{time}</p> 
                </div>
            </div>
        </div>
    )
} 

export default Transaction;