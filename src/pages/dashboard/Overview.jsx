export default function Overview() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Dashboard Overview
        </h1>
  
        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
  
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-slate-400">Portfolios Created</h3>
            <p className="text-3xl font-bold mt-2">1</p>
          </div>
  
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-slate-400">Projects Added</h3>
            <p className="text-3xl font-bold mt-2">3</p>
          </div>
  
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-slate-400">AI Score</h3>
            <p className="text-3xl font-bold mt-2">87%</p>
          </div>
  
        </div>
  
        {/* QUICK ACTION */}
        <div className="mt-10 p-8 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-semibold mb-2">
            Quick Action
          </h2>
  
          <p className="text-slate-400 mb-6">
            Generate your first AI portfolio instantly.
          </p>
  
          <button className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-xl">
            Create Portfolio
          </button>
        </div>
      </div>
    );
  }