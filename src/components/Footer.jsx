export default function Footer() {
    return (
      <footer className="border-t border-white/10 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
  
          <h1 className="text-xl font-bold text-white">
            Stack<span className="text-cyan-400">Weave</span>
          </h1>
  
          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} StackWeave. Built for developers.
          </p>
  
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    );
  }