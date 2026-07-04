import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeMap from './pages/HomeMap';
// Importa tus otras páginas aquí...

// ... resto de tu código ...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeMap />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;