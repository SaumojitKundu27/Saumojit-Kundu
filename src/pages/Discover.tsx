import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { getDiscoverUsers } from "../services/userService.ts";
import { swipeRight } from "../services/matchService.ts";
import { User, X, Check, BookOpen, Star, Heart } from "lucide-react";

export default function Discover({ user: currentUser }: { user: any }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState<any>(null);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await getDiscoverUsers(token);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "right") {
      const token = localStorage.getItem("token");
      if (token && users[currentIndex]) {
        try {
          const result = await swipeRight(users[currentIndex]._id, token);
          if (result.status === "matched") {
            setCurrentMatchId(result.match._id);
            setShowMatchModal(users[currentIndex]);
          }
        } catch (err) {
          console.error("Swipe error:", err);
        }
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) return <div className="text-center py-20">Finding potential buddies...</div>;

  const currentUserCard = users[currentIndex];

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-160px)] flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Discover</h1>
        <p className="text-slate-500">Swipe right to study together</p>
      </header>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentUserCard ? (
            <motion.div
              key={currentUserCard._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-indigo-600 flex items-center justify-center text-white text-6xl font-bold">
                {currentUserCard.name.charAt(0)}
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">{currentUserCard.name}</h2>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star size={18} fill="currentColor" />
                    <span>{currentUserCard.rating || "N/A"}</span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 italic">
                  "{currentUserCard.bio || "No bio yet."}"
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUserCard.subjects?.length > 0 ? (
                        currentUserCard.subjects.map((s: any, i: number) => (
                          <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <BookOpen size={14} />
                            {s.name} (Lvl {s.level})
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm italic">No subjects listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-8">
                <button 
                  onClick={() => handleSwipe("left")}
                  className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-slate-200"
                >
                  <X size={32} />
                </button>
                <button 
                  onClick={() => handleSwipe("right")}
                  className="w-16 h-16 bg-indigo-600 rounded-full shadow-md flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                >
                  <Check size={32} />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <User className="text-slate-400" size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No more buddies found</h2>
              <p className="text-slate-500">Try expanding your search or check back later!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl font-bold border-4 border-white shadow-lg -ml-6">
                  {showMatchModal.name.charAt(0)}
                </div>
              </div>
              
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart fill="currentColor" size={24} />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">It's a Match!</h2>
              <p className="text-slate-600 mb-8">
                You and <span className="font-bold">{showMatchModal.name}</span> have expressed interest in studying together.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (currentMatchId) navigate(`/chat/${currentMatchId}`);
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  Start Chatting
                </button>
                <button 
                  onClick={() => setShowMatchModal(null)}
                  className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
