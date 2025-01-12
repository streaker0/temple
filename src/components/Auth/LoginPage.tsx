// LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Spade } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useGame();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const success = await signIn(email, password);
            if (success) {
                navigate('/home');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during sign in.');
        } finally {
            setIsLoading(false);
        }
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
                <div className="relative flex flex-col items-center justify-center min-h-[600px] px-8 py-12">

                    {/* Card Container */}
                    <div className="w-full max-w-md bg-black/80 backdrop-blur-sm rounded-xl border-2 border-yellow-600/50 shadow-2xl p-8">
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <Spade className="w-20 h-20 text-yellow-500 mb-4" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-glow">
                                Temple of Fortune
                            </h1>
                            <div className="text-lg text-yellow-400 font-semibold">
                                Welcome Back
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-yellow-400 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 bg-black/50 border-2 border-yellow-600/50 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-600/50 transition-colors"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-yellow-400 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 bg-black/50 border-2 border-yellow-600/50 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-600/50 transition-colors"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                                    isLoading
                                        ? 'bg-yellow-900 cursor-not-allowed'
                                        : 'bg-yellow-600 hover:bg-yellow-500 shadow-lg hover:shadow-yellow-500/50'
                                }`}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="text-center pt-4">
                                <a 
                                    href="/signup"
                                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                                >
                                    Don't have an account? Sign up
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};