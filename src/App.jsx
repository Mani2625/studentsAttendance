import './App.css';
import StudentsList from './StudentsList.jsx';
import NavBar from './NavBar.jsx';
import AddStudent from './AddStudent.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    <>
    <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<StudentsList />} />
            <Route path="/add-student" element={<AddStudent />} />
        </Routes>
    </Router>
    </>
  );
}

export default App
