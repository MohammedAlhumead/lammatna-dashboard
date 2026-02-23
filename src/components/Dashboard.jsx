import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ gatherings, guests, foods }) {
  
  // --- 1. إعداد التاريخ الهجري (اسم اليوم الحالي + تاريخ هجري معدل) ---
  const [todayHijri, setTodayHijri] = useState("");

  useEffect(() => {
    const today = new Date(); // تاريخ اليوم الحقيقي (عشان ناخذ منه اسم "الاثنين")
    
    // تاريخ معدل (ناقص يوم) عشان ناخذ منه رقم "28"
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate());

    // 1. استخراج اسم اليوم فقط (من تاريخ اليوم)
    const weekday = new Intl.DateTimeFormat('ar-SA', { 
      weekday: 'long' 
    }).format(today);

    // 2. استخراج التاريخ الهجري (من التاريخ المعدل)
    const datePart = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(adjustedDate);
    
    // 3. دمجهم معاً
    setTodayHijri(`${weekday}، ${datePart} `);
  }, []);

  // --- 2. دالة تنسيق التواريخ للعرض في البطاقات ---
  const formatHijriDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric', month: 'long'
      }).format(new Date(dateString));
    } catch (e) { return dateString; }
  };

  // --- 3. الحسابات والإحصائيات ---
  const totalGatherings = gatherings.length;
  const upcomingGatheringsList = gatherings.filter(g => g.status === "قادمة");
  const upcomingCount = upcomingGatheringsList.length;
  
  const totalGuests = guests.length;
  const totalFoods = foods.length;

  const mainDishes = foods.filter(f => f.type === "رئيسي").length;
  const sweets = foods.filter(f => f.type === "حلويات").length;
  const drinks = foods.filter(f => f.type === "مشروبات").length;
  
  const nextGathering = upcomingGatheringsList.sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;

  return (
    <div className="dashboard-container">
      
      {/* --- هيدر الصفحة --- */}
      <div className="dashboard-header">
        
        <div>
          <div className="dashboard-header-date-section">
            <span>📅</span>
            <span className="dashboard-header-date-text">{todayHijri}</span>
          </div>
        </div>

        <div className="dashboard-header-status">
           <span>{upcomingCount > 0 ? '🌙 رمضان يجمعنا' : '🤲 تقبل الله طاعتكم'}</span>
        </div>
      </div>

      {/* --- الإحصائيات --- */}
      <div className="stats-grid">
        <div className={`stat-card stat-card-gatherings`}>
          <div className="stat-card-content">
            <span>العزائم 🕌</span>
            <span className="stat-card-value">{totalGatherings}</span>
          </div>
          <p className="stat-card-subtitle">({upcomingCount} قادمة)</p>
        </div>

        <div className={`stat-card stat-card-guests`}>
          <div className="stat-card-content">
            <span>الضيوف 👥</span>
            <span className="stat-card-value">{totalGuests}</span>
          </div>
          <p className="stat-card-subtitle">مسجلين في الدليل</p>
        </div>

        <div className={`stat-card stat-card-foods`}>
          <div className="stat-card-content">
            <span>الأطباق 🥘</span>
            <span className="stat-card-value">{totalFoods}</span>
          </div>
          <p className="stat-card-subtitle">أصناف متنوعة</p>
        </div>
      </div>

      {/* --- القسم السفلي --- */}
      <div className="bottom-grid">
        
        <div className="info-card">
          <h3 className="info-card-title">⏳ العزيمة القادمة</h3>
          {nextGathering ? (
            <div className="next-gathering-content">
              <h2 className="next-gathering-title">{nextGathering.title}</h2>
              <p className="next-gathering-detail">📅 التاريخ: <b>{formatHijriDate(nextGathering.date)}</b></p>
              <p className="next-gathering-detail">📍 المكان: <b>{nextGathering.location}</b></p>
              <div className="next-gathering-message">
                باقي عليها القليل! جهزوا القهوة ☕
              </div>
            </div>
          ) : (
            <div className="no-gathering">
              <span className="no-gathering-icon">😴</span>
              <p>لا توجد عزائم قادمة حالياً، استرح قليلاً!</p>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3 className="info-card-title">📊 توزيع السفرة</h3>
          <div className="distribution-container">
            <div className="distribution-item">
              <span>أطباق رئيسية 🍖</span><span>{mainDishes}</span>
            </div>
            <div className="progress-bar-container">
              <div className={`progress-fill progress-main-dishes`} style={{ width: `${(mainDishes/totalFoods)*100}%` }}></div>
            </div>
            <div className="distribution-item">
              <span>حلويات 🍩</span><span>{sweets}</span>
            </div>
            <div className="progress-bar-container">
              <div className={`progress-fill progress-sweets`} style={{ width: `${(sweets/totalFoods)*100}%` }}></div>
            </div>
            <div className="distribution-item">
              <span>مشروبات ☕</span><span>{drinks}</span>
            </div>
            <div className="progress-bar-container">
              <div className={`progress-fill progress-drinks`} style={{ width: `${(drinks/totalFoods)*100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;