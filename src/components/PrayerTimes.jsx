import { useState, useEffect } from "react";
import './PrayerTimes.css';

function PrayerTimes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // قائمة الاقتراحات القادمة من الـ API
  const [selectedCity, setSelectedCity] = useState(null);
  const [prayerData, setPrayerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- 1. البحث اللحظي (Autocomplete) ---
  useEffect(() => {
    // نستخدم "Debounce" (تأخير بسيط) عشان ما نرسل طلب مع كل حرف ونضغط السيرفر
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchCities(searchTerm);
      } else {
        setSuggestions([]); // نخفي القائمة لو النص قصير
      }
    }, 500); // ينتظر نصف ثانية بعد توقف الكتابة

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // دالة جلب المدن من Open-Meteo Geocoding API (مجاني وسريع ويدعم العربية)
  const fetchCities = async (query) => {
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=ar&format=json`);
      const data = await res.json();
      
      if (data.results) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("خطأ في البحث عن المدينة:", err);
    }
  };

  // --- 2. عند اختيار مدينة من القائمة ---
  const handleSelectCity = (city) => {
    // نحدث النص في المربع
    setSearchTerm(city.name);
    // نحفظ المدينة المختارة مع دولتها
    setSelectedCity({ 
        name: city.name, 
        country: city.country,
        lat: city.latitude, 
        lon: city.longitude 
    });
    setSuggestions([]); // نخفي القائمة
    fetchPrayers(city.latitude, city.longitude); // نجلب الصلاة فوراً
  };

  // --- 3. جلب مواقيت الصلاة (بالإحداثيات لدقة 100%) ---
  const fetchPrayers = (lat, lon) => {
    setLoading(true);
    setError("");
    
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // نستخدم الإحداثيات (Lat/Lon) لأنها أدق شيء عالمياً
    fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=4&month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.code === 200 && data.data) {
           const today = date.getDate();
           // نأخذ الأيام المتبقية فقط
           const upcomingDays = data.data.filter(day => parseInt(day.date.gregorian.day) >= today);
           setPrayerData(upcomingDays.slice(0, 7)); // نعرض أسبوع
        } else {
           setError("تعذر جلب البيانات لهذه المدينة");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("حدث خطأ في الاتصال");
        setLoading(false);
      });
  };

  return (
    <div className="prayer-page">
      
      <div className="prayer-page-header">
        <h2>🕰️ مواقيت الصلاة العالمية</h2>
        <p className="prayer-page-description">ابحث عن أي مدينة في العالم (بالعربي أو الإنجليزي)</p>
      </div>

      {/* --- مربع البحث الذكي --- */}
      <div className="prayer-search-container">
        <input
          type="text"
          placeholder="ابدأ بالكتابة... (مثال: القاهرة، London)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="prayer-search-input"
        />
        
        {/* قائمة الاقتراحات المنسدلة (تظهر تلقائياً) */}
        {suggestions.length > 0 && (
          <ul className="prayer-suggestions-list">
            {suggestions.map((city) => (
              <li 
                key={city.id} 
                onClick={() => handleSelectCity(city)}
                className="prayer-suggestion-item"
              >
                <span className="prayer-suggestion-city">{city.name}</span>
                <span className="prayer-suggestion-country">{city.country} 🌍</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* رسالة الخطأ */}
      {error && <p className="prayer-error">{error}</p>}

      {/* --- جدول العرض --- */}
      {loading ? (
        <div className="prayer-loading">
          <h3>⏳ جاري جلب المواقيت...</h3>
        </div>
      ) : selectedCity && prayerData.length > 0 ? (
        <div className="prayer-data-container">
          
          <div className="prayer-city-info">
             <h2>{selectedCity.name}</h2>
             <span>{selectedCity.country}</span>
          </div>
          
          {/* direction: rtl لجعل الجدول يبدأ من اليمين */}
          <div className="prayer-table-wrapper">
            <table className="prayer-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الفجر</th>
                  <th>الظهر</th>
                  <th>العصر</th>
                  <th>المغرب</th>
                  <th>العشاء</th>
                </tr>
              </thead>
              <tbody>
                {prayerData.map((day, index) => (
                  <tr key={index} className={index === 0 ? "prayer-today" : ""}>
                    <td>
                      <div className="prayer-hijri-date">
                        {day.date.hijri.day} {day.date.hijri.month.ar}
                      </div>
                      <div className="prayer-gregorian-date">{day.date.gregorian.weekday.en}</div>
                    </td>
                    <td className="prayer-time">{day.timings.Fajr.split(" ")[0]}</td>
                    <td className="prayer-time">{day.timings.Dhuhr.split(" ")[0]}</td>
                    <td className="prayer-time">{day.timings.Asr.split(" ")[0]}</td>
                    <td className="prayer-time">{day.timings.Maghrib.split(" ")[0]}</td>
                    <td className="prayer-time">{day.timings.Isha.split(" ")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#bdc3c7", marginTop: "60px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "10px", opacity: 0.5 }}>🌍</div>
          <p>ابحث عن أي مدينة في العالم للحصول على أوقات الصلاة</p>
        </div>
      )}
    </div>
  );
}


export default PrayerTimes;