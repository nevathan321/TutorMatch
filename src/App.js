import './App.css';
import Dashboard from './Dashboard';
import Nav from './Nav';

function App() {
  return (
    <div className="App">
      <div className='tile'>
        <Nav />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
