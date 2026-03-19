import { Link } from "react-router";
import { Pill, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10"
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
            />
            <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
