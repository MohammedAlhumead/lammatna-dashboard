// src/data/data.js

// 1. بيانات العزائم
// التواريخ هنا ميلادية للبرمجة، والكود في Gatherings.jsx سيحولها لهجري (يوم وشهر فقط)
export const gatheringsData = [
    { 
      id: 1, 
      title: "جمعة الشباب", 
      date: "2026-02-23", // يوافق 5 رمضان
      location: "الاستراحة", 
      status: "قادمة",
      details: [
        { guestName: "خالد", foodName: "كبسة حاشي", foodIcon: "🍖" },
        { guestName: "فيصل", foodName: "فيمتو بارد", foodIcon: "🍷" }
      ]
    },
    { 
      id: 2, 
      title: "فطور العائلة", 
      date: "2026-02-28", // يوافق 10 رمضان
      location: "بيت الجد", 
      status: "قادمة",
      details: [
        { guestName: "الجد عبدالله", foodName: "قهوة وتمر", foodIcon: "☕" },
        { guestName: "العم محمد", foodName: "سمبوسة لحم", foodIcon: "🥟" },
        { guestName: "سارة", foodName: "لقيمات", foodIcon: "🍩" },
        { guestName: "أم فهد", foodName: "شوربة شوفان", foodIcon: "🥣" }
      ]
    },
    { 
      id: 3, 
      title: "غبقة العمل", 
      date: "2026-03-05", // يوافق 15 رمضان
      location: "فندق الريتز", 
      status: "قادمة",
      details: [
        { guestName: "فيصل", foodName: "قهوة وتمر", foodIcon: "☕" }
      ]
    },
    { 
      id: 4, 
      title: "سحور الأصحاب", 
      date: "2026-02-15", // يوافق تقريباً 27-28 شعبان
      location: "المخيم", 
      status: "منتهية",
      // 🔥 تم التعديل هنا: أضفنا ضيوفاً وأطباقاً لكي لا تظهر (0 ضيوف)
      details: [
          { guestName: "خالد", foodName: "كبسة حاشي", foodIcon: "🍖" },
          { guestName: "فيصل", foodName: "سمبوسة لحم", foodIcon: "🥟" },
          { guestName: "العم محمد", foodName: "فيمتو بارد", foodIcon: "🍷" }
      ]
    },
];

// 2. بيانات قائمة الطعام
export const foodsData = [
    { id: 1, name: "كبسة حاشي", type: "رئيسي", icon: "🍖" },
    { id: 2, name: "سمبوسة لحم", type: "مقبلات", icon: "🥟" },
    { id: 3, name: "فيمتو بارد", type: "مشروبات", icon: "🍷" },
    { id: 4, name: "لقيمات", type: "حلويات", icon: "🍩" },
    { id: 5, name: "شوربة شوفان", type: "مقبلات", icon: "🥣" },
    { id: 6, name: "قهوة وتمر", type: "مشروبات", icon: "☕" },
];

// 3. بيانات الضيوف
export const contactsData = [
    { id: 1, name: "الجد عبدالله", phone: "0500000001", img: "https://ui-avatars.com/api/?name=الجد+عبدالله&background=0D8ABC&color=fff&size=128" },
    { id: 2, name: "العم محمد", phone: "0500000002", img: "https://ui-avatars.com/api/?name=العم+محمد&background=27ae60&color=fff&size=128" },
    { id: 3, name: "خالد", phone: "0500000003", img: "https://ui-avatars.com/api/?name=خالد&background=e67e22&color=fff&size=128" },
    { id: 4, name: "سارة", phone: "0500000004", img: "https://ui-avatars.com/api/?name=سارة&background=e74c3c&color=fff&size=128" },
    { id: 5, name: "فيصل", phone: "0500000005", img: "https://ui-avatars.com/api/?name=فيصل&background=8e44ad&color=fff&size=128" },
    { id: 6, name: "أم فهد", phone: "0500000006", img: "https://ui-avatars.com/api/?name=أم+فهد&background=f1c40f&color=fff&size=128" },
];