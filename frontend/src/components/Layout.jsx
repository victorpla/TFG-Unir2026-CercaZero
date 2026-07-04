import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Contenido dinámico (donde irán tus páginas) */}
      <main className="flex-grow overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Menú de Navegación Inferior (Fijo) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3">
        <Link to="/" className="text-sm font-medium text-green-600">Mapa</Link>
        <Link to="/donar" className="text-sm font-medium text-gray-500">Donar</Link>
        <Link to="/perfil" className="text-sm font-medium text-gray-500">Perfil</Link>
      </nav>
    </div>
  );
};

export default Layout;