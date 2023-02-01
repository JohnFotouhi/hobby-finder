import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Search from './pages/Search';
import Header from './components/Header';
import Explore from './pages/Explore';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    fetch("/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Explore />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Explore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
