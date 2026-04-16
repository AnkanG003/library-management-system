import React from "react";

const ActiveLoans = ({ loans, onReturn }) => {
  // Helper to calculate days remaining
  const getDaysRemaining = (dueDate) => {
    const target = new Date(dueDate);
    const today = new Date();
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 mb-10 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          My Active Loans
        </h2>
        <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-slate-400">
          {loans.length} BOOK(S) TOTAL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map((loan) => {
          const daysLeft = getDaysRemaining(loan.dueDate);
          const isUrgent = daysLeft <= 2;

          return (
            <div key={loan.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 group">
              <h4 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                {loan.book.title}
              </h4>
              <p className="text-slate-400 text-sm mb-4">by {loan.book.author}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-5 text-[10px] uppercase tracking-widest font-semibold text-slate-500">
                <div>
                  <p>Borrowed On</p>
                  <p className="text-slate-200 mt-1">{new Date(loan.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>Due Date</p>
                  <p className={`${isUrgent ? 'text-red-400' : 'text-slate-200'} mt-1`}>
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                  isUrgent ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isUrgent ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                  {daysLeft <= 0 ? "Return Today" : `${daysLeft} Days Left`}
                </div>
                
                <button 
                  onClick={() => onReturn(loan.book.id)}
                  className="text-xs bg-white text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                >
                  Return
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ActiveLoans;