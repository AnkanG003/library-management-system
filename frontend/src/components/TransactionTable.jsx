import React, { useState } from 'react';

const TransactionTable = ({ transactions }) => {
  const [filter, setFilter] = useState('ALL');

  // Logic to filter the list based on the button clicked
  const filteredTransactions = transactions.filter((record) => {
    if (filter === 'ALL') return true;
    return record.status === filter;
  });

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {['ALL', 'ISSUED', 'RETURNED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === status
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="py-4 px-6 text-left">User</th>
              <th className="py-4 px-6 text-left">Book Title</th>
              <th className="py-4 px-6 text-center">Issue Date</th>
              <th className="py-4 px-6 text-center">Due Date</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 text-sm">
            {filteredTransactions.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 text-left">
                    <span className="font-semibold text-slate-700">{record.username}</span>
                </td>
                <td className="py-4 px-6 text-left italic text-slate-500">{record.bookTitle}</td>
                <td className="py-4 px-6 text-center">{record.issueDate}</td>
                <td className="py-4 px-6 text-center">{record.dueDate}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    record.status === 'ISSUED' 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 italic">No records match the "{filter}" filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;