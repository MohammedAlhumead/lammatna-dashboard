import { useState, useEffect } from "react";
import { adhkarList } from "../data/Adhkar";
import './Adhkar.css';

function AdhkarPage() {
  const [currentDhikr, setCurrentDhikr] = useState("");
  const [loading, setLoading] = useState(true);

  const getRandomDhikr = () => {
    const randomIndex = Math.floor(Math.random() * adhkarList.length);
    setCurrentDhikr(adhkarList[randomIndex]);
  };

  useEffect(() => {
    getRandomDhikr();
    setLoading(false);
  }, []);

  return (
    <div className="adhkar-page">
      <div className="adhkar-page-header">
        <h2>📿 ذكر ودعاء</h2>
      </div>

      <div className="adhkar-card">
        {loading ? (
          <p className="adhkar-loading">⏳ جاري جلب الأذكار...</p>
        ) : currentDhikr ? (
          <>
            <h3 className="adhkar-text">
              {currentDhikr}
            </h3>

            <button 
              onClick={getRandomDhikr}
              className="adhkar-next-btn"
            >
              🔄 ذكر آخر
            </button>
          </>
        ) : (
          <p className="adhkar-no-data">لا توجد أذكار متاحة</p>
        )}
      </div>
    </div>
  );
}

export default AdhkarPage;