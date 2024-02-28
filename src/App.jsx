import CRMapp from './apps/CRMapp';
import { BrowserRouter as Router } from 'react-router-dom';
import "./css/custom.css";

function App() {
  return (
    <Router>
      <CRMapp />
    </Router>
  );
}

export default App;
