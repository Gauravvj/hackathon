import { Link } from "react-router";
import { Pill } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-bold text-lg text-slate-800">MedReminder</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Dedicated to Alzheimer's care. We provide gentle medication reminders designed specifically for patients experiencing memory loss, bringing peace of mind to families.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Features</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Security</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Mobile App</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} MedReminder, Inc. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">X</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">in</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
