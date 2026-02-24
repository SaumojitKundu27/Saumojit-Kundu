import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Users, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getMatches } from "../services/matchService.ts";

export default function Dashboard({ user }: { user: any }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await getMatches(token);
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const stats = [
    { label: "Active Matches", value: matches.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Study Groups", value: "0", icon: Search, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Messages", value: "0", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rating", value: user.rating?.toString() || "N/A", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name}!</h1>
        <p className="text-slate-600 mt-1">Ready to find your next study buddy?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <h3 className="text-slate-500 font-medium">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      <section className="bg-indigo-600 rounded-3xl p-8 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Find your perfect match</h2>
          <p className="text-indigo-100 mb-6">
            Our algorithm matches you with students who share your subjects and complement your skill level.
          </p>
          <Link 
            to="/discover"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Start Swiping
          </Link>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 -skew-x-12 translate-x-1/2" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Active Matches</h2>
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matches.map((match) => (
                <div key={match._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {match.otherUser.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{match.otherUser.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.otherUser.subjects?.slice(0, 2).map((s: any, i: number) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link 
                    to={`/chat/${match._id}`}
                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                  >
                    <MessageSquare size={20} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-slate-400" size={32} />
              </div>
              <h3 className="text-slate-900 font-semibold mb-2">No matches yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Start matching with other students to see your buddies here.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Your Profile</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {user.subjects?.length > 0 ? (
                    user.subjects.map((s: any, i: number) => (
                      <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium">
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">No subjects added</span>
                  )}
                </div>
              </div>
              <Link 
                to="/profile"
                className="block w-full text-center border border-slate-200 text-slate-600 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
