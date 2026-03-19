import { Link } from "react-router";
import { Pill, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "motion/react";

export function Register() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-1/4 -z-10 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 left-1/4 -z-10 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-blue-100 p-2 rounded-xl group-hover:bg-blue-200 transition-colors">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              MedReminder
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join thousands of families managing Alzheimer's care seamlessly.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder="John"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              required
            />
            <p className="mt-2 text-xs text-slate-500">Must be at least 8 characters long.</p>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
              required
            />
            <label htmlFor="terms" className="text-sm text-slate-600 leading-snug">
              I agree to MedReminder's <a href="#" className="font-medium text-blue-600 hover:text-blue-700 underline">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 mt-4"
          >
            Create account
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
