import { useState } from "react";
import { motion } from "motion/react";
import { updateProfile } from "../services/userService.ts";
import { Save, Plus, X } from "lucide-react";

export default function Profile({ user, setUser }: { user: any; setUser: any }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [subjects, setSubjects] = useState(user.subjects || []);
  const [newSubject, setNewSubject] = useState("");
  const [newLevel, setNewLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddSubject = () => {
    if (!newSubject) return;
    setSubjects([...subjects, { name: newSubject, level: newLevel }]);
    setNewSubject("");
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data = await updateProfile({ name, bio, subjects }, token);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Your Profile</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.includes("success") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              placeholder="Tell others about your study habits and goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Subjects & Proficiency</label>
            
            <div className="space-y-3 mb-4">
              {subjects.map((sub: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-900">{sub.name}</span>
                    <span className="ml-2 text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">Level {sub.level}/5</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Data Structures"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <select 
                className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>Lvl {l}</option>)}
              </select>
              <button 
                type="button"
                onClick={handleAddSubject}
                className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
