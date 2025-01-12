import { useState } from 'react';
import { Coins, Spade, ArrowDownCircle, ArrowUpCircle, PlayCircle, LogOut } from 'lucide-react';
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

const HomePage = () => {
    const navigate = useNavigate();
    const {balance, setBalance, signOut} = useGame();
    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    
    const handleDeposit = () => {
        const depositAmount = parseFloat(amount);
        if (!isNaN(depositAmount) && depositAmount > 0) {
            setIsDepositing(true);
            setTimeout(() => {
                setBalance(balance + depositAmount);
                setAmount('');
                setIsDepositing(false);
            }, 500);
        }
    };

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount);
        if (!isNaN(withdrawAmount) && withdrawAmount > 0 && withdrawAmount <= balance) {
            setIsWithdrawing(true);
            setTimeout(() => {
                setBalance(balance - withdrawAmount);
                setAmount('');
                setIsWithdrawing(false);
            }, 500);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <Layout>
            <div className="w-full max-w-4xl min-h-[600px] relative">
                {/* Decorative Background */}
                <div className="absolute inset-0">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="temple-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="rgba(218,165,32,0.1)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="#1a1a1a"/>
                        <rect width="100%" height="100%" fill="url(#temple-pattern)"/>
                    </svg>
                </div>

                {/* Main Content */}
                <div className="relative flex flex-col items-center justify-between min-h-[600px] px-8 py-12">
                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>

                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <Spade className="w-20 h-20 text-yellow-500 mb-4" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-glow">
                            Temple of Fortune
                        </h1>
                        <div className="text-lg text-yellow-400 font-semibold">
                            Welcome to the Temple
                        </div>
                    </div>

                    {/* Balance Display */}
                    <div className="w-full max-w-md bg-black/40 backdrop-blur-sm rounded-xl border-2 border-yellow-600/50 p-8 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Coins className="w-6 h-6 text-yellow-500" />
                            <span className="text-2xl font-semibold text-white">
                                Your Fortune
                            </span>
                        </div>
                        <div className="text-4xl font-bold text-yellow-400 text-center">
                            ${balance.toFixed(2)}
                        </div>
                    </div>

                    {/* Transaction Controls */}
                    <div className="w-full max-w-md space-y-6">
                        <div className="flex justify-center">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    min="0"
                                    className="w-full pl-8 pr-4 py-3 bg-black/30 border-2 border-yellow-600/50 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-600/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDeposit}
                                disabled={isDepositing}
                                className="flex items-center gap-2 bg-green-600/80 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowDownCircle className="w-5 h-5" />
                                {isDepositing ? 'Processing...' : 'Deposit'}
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={isWithdrawing || parseFloat(amount) > balance}
                                className="flex items-center gap-2 bg-amber-600/80 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowUpCircle className="w-5 h-5" />
                                {isWithdrawing ? 'Processing...' : 'Withdraw'}
                            </button>
                        </div>
                    </div>

                    {/* Play Button */}
                    <button
                        onClick={() => navigate('/play')}
                        className="mt-8 flex items-center gap-2 bg-yellow-600/80 hover:bg-yellow-500 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-500/30"
                    >
                        <PlayCircle className="w-6 h-6" />
                        Play Now
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;