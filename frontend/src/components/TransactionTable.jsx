import React, { useState } from 'react';
import api from '../services/api';

const TransactionTable = ({ transactions, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState(null);

  const handleReturn = async (transactionId) => {
    if (!window.confirm("Are you sure you want to mark this book as returned?")) return;

    setProcessingId(transactionId);
    try {
      await api.post(`/borrow/admin/return/${transactionId}`);
      alert("Book marked as returned successfully!");
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (error) {
      console.error("Return Error:", error);
      alert(error.response?.data?.message || error.response?.data || "Failed to process return.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTransactions = transactions.filter((record) => {
    if (filter === 'ALL') return true;
    return record.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filter Tabs */}
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

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Book Details</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTransactions.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-slate-900">{record.username}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 font-medium">{record.bookTitle}</div>
                  <div className="text-[10px] text-slate-400">ID: #{record.id}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-[11px] text-slate-500">Issued: {record.issueDate}</div>
                  <div className="text-[11px] text-red-500 font-medium">Due: {record.dueDate}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                    record.status === 'ISSUED' 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {record.status === 'ISSUED' ? (
                    <button
                      onClick={() => handleReturn(record.id)}
                      disabled={processingId === record.id}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      {processingId === record.id ? "Processing..." : "Mark Returned"}
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">No records found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;