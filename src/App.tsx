import { AppProvider } from './context/AppProvider';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #DDD6FE 100%)' }}>
        <Header />
        <MainLayout />
      </div>
    </AppProvider>
  );
}

export default App;
