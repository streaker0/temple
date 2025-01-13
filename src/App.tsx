import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import BettingPage from './components/BettingPage/BettingPage'
import HomePage from './components/HomePage/HomePage'
import { LoginPage } from './components/Auth/LoginPage'
import { SignupPage } from './components/Auth/SignupPage'
import './App.css'
import { GameProvider } from './context/GameContext'
import { useGame } from './context/GameContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useGame();
	
	if (!isAuthenticated) {
	  return <Navigate to="/login" replace />;
	}
	
	return <>{children}</>;
  };
  
  const AppRoutes = () => {
	return (
	  <Routes>
		<Route path="/" element={<LoginPage />} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/signup" element={<SignupPage />} />
		<Route path="/home" element={
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		}/>
		<Route
		  path="/play"
		  element={
			<ProtectedRoute>
			  <BettingPage />
			</ProtectedRoute>
		  }
		/>
		
	  </Routes>
	);
  };

function App() {
	return (
		<GameProvider>
			<Router>
				<div className="App">
					<AppRoutes/>
				</div>
			</Router>
		</GameProvider>

	)
}

export default App
