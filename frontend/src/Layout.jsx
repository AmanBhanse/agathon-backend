import Header from './Header';
import Sidebar from './Sidebar';
import { useCaseStore } from './store';
import './Layout.css';

export default function Layout({ children }) {
  const currentPage = useCaseStore((state) => state.currentPage);
  const setCurrentPage = useCaseStore((state) => state.setCurrentPage);

  return (
    <div className="layout-container">
      <Header />
      <div className="layout-content-wrapper">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
