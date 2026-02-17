import React, { useState } from 'react';
import './Gatherings.css';

function Gatherings({ gatherings, setGatherings, deleteGathering, allGuests, allFoods }) {
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(null);
  const [step, setStep] = useState(1);
  const [newGathering, setNewGathering] = useState({
    title: "", date: "", location: "", selectedGuestIds: [], foodAssignments: {}
  });

  // --- إعدادات التقويم الرمضاني ---
  const RAMADAN_START_DATE = new Date("2026-02-18");

  const getGregorianFromRamadan = (day) => {
    const date = new Date(RAMADAN_START_DATE);
    date.setDate(date.getDate() + (day - 1));
    return date.toISOString().split('T')[0];
  };

  const getRamadanDayFromDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // نتجاهل الوقت للمقارنة الصحيحة
    const justDate = new Date(date.toISOString().split('T')[0]);
    const ramadanStart = new Date(RAMADAN_START_DATE.toISOString().split('T')[0]);

    if (justDate < ramadanStart) {
        // 🔥 التعديل هنا: نستخدم الدالة التي لا تعرض السنة
        return formatHijriDate(dateString);
    }

    const diffTime = Math.abs(date - RAMADAN_START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return `${diffDays} رمضان`;
  };

  // 🔥 دالة التاريخ الهجري (تم تعديلها لإزالة السنة)
  const formatHijriDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric', 
        month: 'long' 
        // قمنا بإزالة year: 'numeric' لكي يظهر اليوم والشهر فقط (مثال: 28 شعبان)
      }).format(new Date(dateString));
    } catch (e) { return dateString; }
  };

  // --- المعالجة والترتيب ---
  const today = new Date().toISOString().split('T')[0];

  const processedGatherings = gatherings.map(g => {
    if (g.status === "ملغية") return g;
    if (g.date < today) return { ...g, status: "منتهية" };
    return g;
  });

  const sortedGatherings = processedGatherings.sort((a, b) => {
    const statusPriority = { "قادمة": 1, "منتهية": 2, "ملغية": 3 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(a.date) - new Date(b.date);
  });

  // --- الدوال ---
  const handleCancelGathering = (id) => {
    if (window.confirm("هل أنت متأكد من إلغاء هذه العزيمة؟")) {
      setGatherings(gatherings.map(g => g.id === id ? { ...g, status: "ملغية" } : g));
    }
  };

  const handleAddGathering = () => {
    const finalGathering = {
      id: Date.now(),
      title: newGathering.title,
      date: newGathering.date,
      location: newGathering.location,
      status: "قادمة",
      details: newGathering.selectedGuestIds.map(gId => {
        const guest = allGuests.find(g => g.id === parseInt(gId));
        const foodId = newGathering.foodAssignments[gId];
        const food = allFoods.find(f => f.id === parseInt(foodId));
        return {
          guestName: guest ? guest.name : "ضيف",
          foodName: food ? food.name : "بدون طبق",
          foodIcon: food ? food.icon : "🍽️"
        };
      })
    };
    setGatherings([...gatherings, finalGathering]);
    resetForm();
  };

  const resetForm = () => {
    setNewGathering({ title: "", date: "", location: "", selectedGuestIds: [], foodAssignments: {} });
    setStep(1);
    setShowModal(false);
  };

  const handleGuestToggle = (id) => {
    const ids = newGathering.selectedGuestIds;
    if (ids.includes(id)) {
      setNewGathering({ ...newGathering, selectedGuestIds: ids.filter(i => i !== id) });
    } else {
      setNewGathering({ ...newGathering, selectedGuestIds: [...ids, id] });
    }
  };

  const handleFoodAssign = (guestId, foodId) => {
    setNewGathering({
      ...newGathering,
      foodAssignments: { ...newGathering.foodAssignments, [guestId]: foodId }
    });
  };

  return (
    <div className="page-container">
      <div className="gatherings-page-header">
        <h2>🕌 جدول العزائم</h2>
        <button onClick={() => setShowModal(true)} className="gatherings-add-btn">
          + جدولة عزيمة جديدة
        </button>
      </div>

      <div className="gatherings-cards-grid">
        {sortedGatherings.map((item) => (
          <div key={item.id} className={`gathering-card gathering-card-${item.status === 'قادمة' ? 'upcoming' : item.status === 'منتهية' ? 'completed' : 'cancelled'}`}>
            <span className={`gathering-status-badge gathering-status-${item.status === 'قادمة' ? 'upcoming' : item.status === 'منتهية' ? 'completed' : 'cancelled'}`}>
              {item.status}
            </span>

            <h3 className="gathering-card-title">{item.title}</h3>
            
            <div className="gathering-card-detail">📅 <b>الموعد:</b> {getRamadanDayFromDate(item.date)}</div>
            <div className="gathering-card-detail">📍 <b>المكان:</b> {item.location}</div>
            <div className="gathering-card-details-section">👥 <b>الضيوف:</b> {item.details ? item.details.length : 0} شخص</div>

            <div className="gathering-card-buttons">
              <button onClick={() => setDetailsModal(item)} className="gathering-btn-details">
                👁️ التفاصيل
              </button>
              {item.status === 'قادمة' && (
                <button onClick={() => handleCancelGathering(item.id)} className="gathering-btn-cancel">
                  🚫 إلغاء
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- نافذة التفاصيل --- */}
      {detailsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-header-title">{detailsModal.title}</h2>
              <p className="modal-header-subtitle">{getRamadanDayFromDate(detailsModal.date)} | {detailsModal.location}</p>
            </div>
            
            <h4>📋 قائمة الضيوف والأطباق:</h4>
            <ul className="details-list">
              {detailsModal.details && detailsModal.details.length > 0 ? (
                detailsModal.details.map((detail, index) => (
                  <li key={index} className="details-item">
                    <span className="details-item-name">👤 {detail.guestName}</span>
                    <span className="details-item-food">{detail.foodIcon} {detail.foodName}</span>
                  </li>
                ))
              ) : (
                <p className="no-details-message">لا توجد تفاصيل مسجلة.</p>
              )}
            </ul>
            <button onClick={() => setDetailsModal(null)} className="btn-close">إغلاق</button>
          </div>
        </div>
      )}

      {/* --- نافذة الإضافة (Wizard) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content.wide">
            <h3 className="modal-step-title">
              {step === 1 && "1️⃣ بيانات العزيمة"}
              {step === 2 && "2️⃣ اختيار الضيوف"}
              {step === 3 && "3️⃣ توزيع الأطباق"}
            </h3>

            {step === 1 && (
              <div className="form-group">
                <input type="text" placeholder="اسم العزيمة" value={newGathering.title} onChange={e => setNewGathering({...newGathering, title: e.target.value})} className="form-input" />
                
                <div>
                    <label className="ramadan-day-label">اختر يوم رمضان 🌙:</label>
                    <div className="ramadan-day-grid">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                            const isSelected = getRamadanDayFromDate(newGathering.date) === `${day} رمضان`;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setNewGathering({...newGathering, date: getGregorianFromRamadan(day)})}
                                    className={`ramadan-day-btn ${isSelected ? 'selected' : ''}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    {newGathering.date && <p className="ramadan-date-confirmation">✅ تم اختيار: {getRamadanDayFromDate(newGathering.date)}</p>}
                </div>

                <input type="text" placeholder="المكان" value={newGathering.location} onChange={e => setNewGathering({...newGathering, location: e.target.value})} className="form-input" />
                <button onClick={() => setStep(2)} disabled={!newGathering.title || !newGathering.date} className="btn-next">التالي ⬅️</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>حدد من سيحضر:</p>
                <div className="guest-selection-container">
                  {allGuests.map(guest => (
                    <label key={guest.id} className={`guest-checkbox-label ${newGathering.selectedGuestIds.includes(guest.id) ? 'selected' : ''}`}>
                      <input type="checkbox" checked={newGathering.selectedGuestIds.includes(guest.id)} onChange={() => handleGuestToggle(guest.id)} />
                      <span>{guest.name}</span>
                    </label>
                  ))}
                </div>
                <div className="btn-group">
                  <button onClick={() => setStep(1)} className="btn-back">رجوع</button>
                  <button onClick={() => setStep(3)} disabled={newGathering.selectedGuestIds.length === 0} className="btn-next">التالي ⬅️</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '10px' }}>ماذا سيحضر كل ضيف؟</p>
                <div className="food-assignment-container">
                  {newGathering.selectedGuestIds.map(guestId => {
                    const guest = allGuests.find(g => g.id === parseInt(guestId));
                    return (
                      <div key={guestId} className="food-assignment-item">
                        <span style={{ fontWeight: 'bold' }}>👤 {guest.name}</span>
                        <select className="food-assignment-select" onChange={(e) => handleFoodAssign(guestId, e.target.value)}>
                          <option value="">اختر الطبق...</option>
                          {allFoods.map(food => (
                            <option key={food.id} value={food.id}>{food.icon} {food.name}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                <div className="btn-group">
                  <button onClick={() => setStep(2)} className="btn-back">رجوع</button>
                  <button onClick={handleAddGathering} className="btn-finish">✅ اعتماد العزيمة</button>
                </div>
              </div>
            )}
            <button onClick={resetForm} className="modal-close-btn">❌</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Gatherings;