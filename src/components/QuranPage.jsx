import { useState, useEffect } from "react";
import './Quran.css';

function QuranPage() {
  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAyah = () => {
    setLoading(true);
    // إضافة طابع زمني للرابط لمنع تكرار نفس الآية
    fetch(`https://api.alquran.cloud/v1/ayah/random/ar.abdurrahmaansudais?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        setAyah(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAyah();
  }, []);

  return (
    <div className="quran-page">
      <div className="quran-page-header">
        <h2>📖 نفحات قرآنية</h2>
      </div>

      <div className="quran-card">
        {loading ? (
          <p className="quran-loading">⏳ جاري جلب الآية...</p>
        ) : ayah && (
          <>
            <div className="quran-surah-info">
               {ayah.surah.name} - آية {ayah.numberInSurah}
            </div>
            
            <h3 className="quran-ayah-text">
              ﴿ {ayah.text} ﴾
            </h3>

            {/* مفتاح (Key) مهم جداً لإعادة تحميل مشغل الصوت عند تغيير الآية */}
            <div className="quran-audio-wrapper">
              <audio controls autoPlay src={ayah.audio} key={ayah.audio} className="quran-audio" />
            </div>
            
            <button 
              onClick={fetchAyah}
              className="quran-next-btn"
            >
              🔄 آية أخرى
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuranPage;