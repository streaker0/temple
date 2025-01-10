import { useState } from 'react'
import { Coins, Spade, ArrowDownCircle, ArrowUpCircle, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}

const TemplePage = () => {
    const navigate = useNavigate();
    const {balance, setBalance} = useGame()
    const [amount, setAmount] = useState('')
    const [username] = useState('Player1') // TODO: Get from auth
    
    const handleDeposit = () => {
        const depositAmount = parseFloat(amount)
        if (!isNaN(depositAmount) && depositAmount > 0) {
            setBalance(balance + depositAmount)
            setAmount('')
        }
    }

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount)
        if (!isNaN(withdrawAmount) && withdrawAmount > 0 && withdrawAmount <= balance) {
            setBalance(balance - withdrawAmount)
            setAmount('')
        }
    }

    return (
        <Layout>
            <div className="w-full max-w-4xl min-h-[600px] bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-2xl p-12 border-t-4 border-amber-400 transform transition-all flex flex-col justify-between">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="relative">
                        <Spade className="w-20 h-20 mx-auto mb-4 text-purple-800" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold text-purple-900 mb-2">
                        Temple of Fortune
                    </h1>
                    <div className="text-xl text-purple-700 font-medium bg-purple-100 rounded-full py-1 px-4 inline-block">
                        Welcome, {username}
                    </div>
                </div>

                {/* Balance Display */}
                <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 rounded-lg p-8 mb-12 text-center shadow-inner">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Coins className="w-6 h-6 text-amber-600" />
                        <span className="text-2xl font-semibold text-purple-900">
                            Your Fortune
                        </span>
                    </div>
                    <div className="text-4xl font-bold text-purple-800">
                        ${balance.toFixed(2)}
                    </div>
                </div>

                {/* Transaction Controls */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                min="0"
                                className="w-48 p-2 border-2 border-purple-300 rounded-lg text-center bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-black"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                                $
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleDeposit}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                            <ArrowDownCircle className="w-5 h-5" />
                            Deposit
                        </button>
                        <button
                            onClick={handleWithdraw}
                            disabled={parseFloat(amount) > balance}
                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                            <ArrowUpCircle className="w-5 h-5" />
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Play Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/play')}
                        className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-12 py-4 rounded-lg text-xl font-semibold mx-auto transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <PlayCircle className="w-6 h-6" />
                        Play Now
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default TemplePage