// SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ChevronLeft, Spade, UserPlus, Mail, Lock, User } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}

export const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useGame();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }

            const success = await signUp(email, password, username);
            
            if (success) {
                alert('Account created successfully! You have been credited with $1,000 to start playing.');
                navigate('/home');
            } else {
                throw new Error('Failed to create account');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign up. Please try again.');
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
                                <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="rgba(147,51,234,0.1)" strokeWidth="1"/>
                            </pattern>
                            <linearGradient id="card-gradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="rgba(88,28,135,0.8)" />
                                <stop offset="100%" stopColor="rgba(67,20,110,0.8)" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="#1a1a1a"/>
                        <rect width="100%" height="100%" fill="url(#temple-pattern)"/>
                    </svg>
                </div>

                {/* Main Content */}
                <div className="relative flex flex-col items-center justify-center min-h-[600px] px-8 py-12">
                    {/* Card Container */}
                    <div className="w-full max-w-md bg-gradient-to-br from-purple-900/80 to-purple-800/80 backdrop-blur-sm rounded-xl border-2 border-purple-500/50 shadow-2xl p-8">
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <div className="relative">
                                    <Spade className="w-20 h-20 text-purple-300 mb-4 transform rotate-45" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <UserPlus className="w-8 h-8 text-purple-200" />
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-glow">
                                Temple of Fortune
                            </h1>
                            <div className="text-lg text-purple-300 font-semibold">
                                Begin Your Journey
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-6">
                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-colors"
                                            placeholder="Choose your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-colors"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-colors"
                                            placeholder="Minimum 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-300 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-colors"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            minLength={8}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                                    isLoading
                                        ? 'bg-purple-900 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-500 shadow-lg hover:shadow-purple-500/50'
                                }`}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <div className="text-center pt-4">
                                <a 
                                    href="/login"
                                    className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                                >
                                    Already have an account? Sign in
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};