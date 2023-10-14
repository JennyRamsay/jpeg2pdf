import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload';

function App() {
  return (
    
    <Router>
    <Routes>
      
        <Route path="/" element={<FileUpload/>} />

    </Routes>  
    </Router>
    
  );
}

export default App;
