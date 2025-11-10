import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const RecentTransactions = ({ transactions, limit = 5 }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleCardClick = (type) => {
    if (type === 'income') navigate('/income');
    else if (type === 'expense') navigate('/expense');
  };

  const handleSeeAllClick = () => setShowPopup(true);

  const handleOptionSelect = (type) => {
    setShowPopup(false);
    if (type === 'income') navigate('/income');
    else navigate('/expense');
  };

  return (
    <div className="card relative">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-btn" onClick={handleSeeAllClick}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, limit)?.map((item) => (
          <div
            key={item._id}
            onClick={() => handleCardClick(item.type)}
            className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <TransactionInfoCard
              title={item.type === 'expense' ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format('DD MMM YYYY')}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center">
            <h4 className="text-lg font-semibold mb-4">View All Transactions</h4>
            <p className="text-sm text-gray-500 mb-6">
              Choose which transactions you want to view
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleOptionSelect('income')}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                Income
              </button>
              <button
                onClick={() => handleOptionSelect('expense')}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Expense
              </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
