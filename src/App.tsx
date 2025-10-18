import { AppProvider } from './context/AppProvider';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-planner-gray-bg">
        <Header />
        <MainLayout />
      </div>
    </AppProvider>
  );
}

export default App;
