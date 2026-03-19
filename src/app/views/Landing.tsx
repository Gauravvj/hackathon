import { motion } from "motion/react";
import { Link } from "react-router";
import { Clock, ShieldCheck, Heart, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export function Landing() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
          <div className="w-[600px] h-[600px] rounded-full bg-blue-50 blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4">
          <div className="w-[500px] h-[500px] rounded-full bg-sky-50 blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium mb-6 border border-blue-200/50">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Dedicated to Alzheimer's care</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Gentle reminders for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">memory</span> care.
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
                Designed exclusively for Alzheimer's patients and their caregivers. MedReminder provides simple, stress-free medication prompts to support memory care and bring peace of mind to your family.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98]"
                >
                  Create Free Account
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 px-8 py-3.5 rounded-full font-semibold border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-[0.98]"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" alt="User" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">+2k</div>
                </div>
                <p>Trusted by thousands daily</p>
              </div>
            </motion.div>

            {/* Right Image/Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100/50 max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-overlay z-10 rounded-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1758612897487-41d0c44c4420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwZWxkZXJseSUyMHBlcnNvbiUyMGhvbGRpbmclMjBzbWFydHBob25lfGVufDF8fHx8MTc3Mzg0MTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Happy elderly person using the app"
                  className="w-full h-auto object-cover aspect-[4/5] object-center"
                />
                
                {/* Floating Notification Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 z-20 flex items-center gap-4"
                >
                  <div className="bg-blue-100 p-2.5 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-semibold text-slate-800 text-sm">Time for Donepezil</h4>
                     <p className="text-slate-500 text-xs">10 mg (Aricept) • After breakfast</p>
                  </div>
                  <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                     <CheckCircle2 className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need for memory care</h2>
            <p className="text-lg text-slate-600">
              Simple tools thoughtfully designed for Alzheimer's patients to maintain routines, keep caregivers informed, and manage medications securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2563eb 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
         
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Support your loved one's memory care today.</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Join thousands of families who have simplified their Alzheimer's care routines. It takes less than a minute to sign up.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
               <Link
                 to="/register"
                 className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20"
               >
                 Get Started for Free
               </Link>
            </motion.div>
         </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Gentle Prompts",
    description: "Receive simple, easy-to-understand notifications tailored specifically for cognitive support.",
    icon: <Clock className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-100"
  },
  {
    title: "Caregiver Sync",
    description: "Keep family members and caregivers instantly updated when medications are taken or missed.",
    icon: <Users className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-100"
  },
  {
    title: "Routine Tracking",
    description: "Monitor adherence over time to provide accurate reports directly to your neurologist or doctor.",
    icon: <Heart className="w-6 h-6 text-rose-600" />,
    color: "bg-rose-100"
  },
  {
    title: "Secure & Private",
    description: "Your health data is encrypted and strictly confidential. We never share your family's data.",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-100"
  }
];
