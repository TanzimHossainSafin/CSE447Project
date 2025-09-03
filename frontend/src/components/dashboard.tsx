import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { encryptData, decryptData } from '../Keygenerate/keygen';

interface Habit {
    id: number;
    name: string;
    description: string;
    userId: number;
}



// Helper function to format encrypted text for display
const formatEncryptedText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export default function Dashboard() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [allUsersHabits, setAllUsersHabits] = useState<any[]>([]);
    const [newHabit, setNewHabit] = useState({ name: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showAddHabit, setShowAddHabit] = useState(false);
    const [decryptedTexts, setDecryptedTexts] = useState<{[key: string]: string}>({});
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchHabits();
        fetchAllUsersHabits();
    }, [navigate]);

    const fetchHabits = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/app/v1/health/habits', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHabits(response.data.habits || []);
        } catch (error) {
            console.error('Error fetching habits:', error);
            setHabits([]);
        }
    };



    const fetchAllUsersHabits = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/app/v1/health/allhabits', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsersHabits(response.data.habits || []);
        } catch (error) {
            console.error('Error fetching all users habits:', error);
        }
    };

    // Refresh all data function
    const refreshAllData = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchHabits(),
                fetchAllUsersHabits()
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.name.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const publicKey = localStorage.getItem('publicKey');
            
            if (!publicKey) {
                throw new Error('Public key not found');
            }
            
            // Encrypt name and description separately
            const encryptedName = await encryptData(newHabit.name, publicKey);
            const encryptedDescription = await encryptData(newHabit.description || '', publicKey);
            
            // Validate encryption was successful
            if (!encryptedName || !encryptedDescription) {
                throw new Error('Encryption failed');
            }
            
            const response = await axios.post('http://localhost:8080/app/v1/health/addhabit', { 
                encryptedName: encryptedName,
                encryptedDescription: encryptedDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh all data after adding habit
            await refreshAllData();
            
            setNewHabit({ name: '', description: '' });
            setShowAddHabit(false);
        } catch (error: any) {
            console.error('Error adding habit:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Failed to add habit'}`);
            } else {
                alert('Network error. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteHabit = async (habitId: number) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete('http://localhost:8080/app/v1/health/delete', {
                headers: { Authorization: `Bearer ${token}` },
                data: { habitId: habitId }
            });
            
            // Refresh all data after deleting habit
            await refreshAllData();
        } catch (error: any) {
            console.error('Error deleting habit:', error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Failed to delete habit'}`);
            } else {
                alert('Network error. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    
    const handleDecryptText = async (id: number, type: 'habit' | 'all', field: 'name' | 'description', encryptedText: string) => {
        const key = `${type}-${id}-${field}`;
        
        // If already decrypted, hide it
        if (decryptedTexts[key]) {
            setDecryptedTexts((prev: {[key: string]: string}) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
            return;
        }

        try {
            const privateKey = localStorage.getItem('privateKey');
            if (!privateKey) {
                alert('Private key not found. Please log out and sign in again.');
                return;
            }

            const decryptedText = await decryptData(encryptedText, privateKey);
            setDecryptedTexts((prev: {[key: string]: string}) => ({
                ...prev,
                [key]: decryptedText
            }));
        } catch (error: any) {
            console.error('Decryption error:', error);
            if (error.message && error.message.includes('Invalid private key')) {
                alert('Private key mismatch. Please log out and sign in again.');
            } else {
                alert('Failed to decrypt text. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">Habits Tracker Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={refreshAllData}
                                disabled={isRefreshing}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50"
                                title="Refresh all data"
                            >
                                <svg className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {isRefreshing ? 'Refreshing...' : 'Refresh All'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Habits Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">My Habits</h2>
                            <button
                                onClick={() => setShowAddHabit(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Habit
                            </button>
                        </div>

                        {habits.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p>No habits yet. Add your first habit!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {habits.map((habit) => (
                                    <div key={habit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm font-mono">
                                                        {decryptedTexts[`habit-${habit.id}-name`] || formatEncryptedText(habit.name, 40)}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleDecryptText(habit.id, 'habit', 'name', habit.name)}
                                                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                                        title={decryptedTexts[`habit-${habit.id}-name`] ? "Hide decrypted text" : "Show decrypted text"}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-600 text-xs font-mono break-all">
                                                        {decryptedTexts[`habit-${habit.id}-description`] || formatEncryptedText(habit.description, 60)}
                                                    </p>
                                                    <button
                                                        onClick={() => handleDecryptText(habit.id, 'habit', 'description', habit.description)}
                                                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                                        title={decryptedTexts[`habit-${habit.id}-description`] ? "Hide decrypted text" : "Show decrypted text"}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteHabit(habit.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors duration-200 flex-shrink-0 ml-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* All Users Habits Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">All Users Habits</h2>
                        </div>

                        {allUsersHabits.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p>No habits from other users yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {allUsersHabits.map((habit) => (
                                    <div key={habit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                                        {habit.user?.username || `User ${habit.userId}`}
                                                    </span>
                                                </div>
                                                <div className="mb-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm font-mono">
                                                        {habit.userId === parseInt(localStorage.getItem('userId') || '0') 
                                                            ? (decryptedTexts[`all-${habit.id}-name`] || formatEncryptedText(habit.name, 30))
                                                            : formatEncryptedText(habit.name, 30)
                                                        }
                                                    </h3>
                                                    {habit.userId === parseInt(localStorage.getItem('userId') || '0') && (
                                                        <button
                                                            onClick={() => handleDecryptText(habit.id, 'all', 'name', habit.name)}
                                                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ml-2"
                                                            title={decryptedTexts[`all-${habit.id}-name`] ? "Hide decrypted text" : "Show decrypted text"}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-xs font-mono break-all">
                                                        {habit.userId === parseInt(localStorage.getItem('userId') || '0')
                                                            ? (decryptedTexts[`all-${habit.id}-description`] || formatEncryptedText(habit.description, 40))
                                                            : formatEncryptedText(habit.description, 40)
                                                        }
                                                    </p>
                                                    {habit.userId === parseInt(localStorage.getItem('userId') || '0') && (
                                                        <button
                                                            onClick={() => handleDecryptText(habit.id, 'all', 'description', habit.description)}
                                                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ml-2"
                                                            title={decryptedTexts[`all-${habit.id}-description`] ? "Hide decrypted text" : "Show decrypted text"}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                </div>
            </main>

            {/* Add Habit Modal */}
            {showAddHabit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Habit</h3>
                            <button
                                onClick={() => setShowAddHabit(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddHabit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    value={newHabit.name}
                                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter habit name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newHabit.description}
                                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter description"
                                    rows={3}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? 'Adding...' : 'Add Habit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddHabit(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
