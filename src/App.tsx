import { BrowserRouter as Router, Routes, Route } from 'react-router'
import BettingPage from './components/BettingPage/BettingPage'
import HomePage from './components/HomePage/HomePage'
import './App.css'
import { GameProvider } from './context/GameContext'

function App() {
	return (
		<GameProvider>
			<Router>
				<div className="App">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/play" element={<BettingPage />} />
					</Routes>
				</div>
			</Router>
		</GameProvider>

	)
}

export default App
