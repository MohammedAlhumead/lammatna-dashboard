import StatCard from "./StatCard";
import ProductPage from "./ProductPage";
import OrdersPage from "./OrdersPage";
import WeatherAPI from "./WeatherAPI";
import StudentsPage from "./StudentsPage"; // استيراد الملف الجديد
import { productsOrders } from "../data/data";
import OrderStatus from "./OrderStatus";
function MainContent({activePage , products, setProducts}) {
 
 const totalProduct = products.length;
const totalOrders = productsOrders.length;

const revenue = productsOrders.reduce((total ,order) => {
  const orderTotal = order.items.reduce((sum ,item) => sum + (item.price * item.qty) ,0);
  return total + orderTotal;
}, 0);
 
 
  if (activePage === "products"){
    return (
      <main className="main">
        <ProductPage products={products} setProducts={setProducts} />
      </main>
    )
  }

  if (activePage === "orders"){
    return (
      <main className="main">
        <OrdersPage />
      </main>
    )
  }
 
  if (activePage === "users") { 
    return (
      <main className="main">
        <StudentsPage />
      </main>
    );
  }

  if (activePage === "weather"){
    return (
      <main className="main">
        <WeatherAPI />
      </main>
    )
  }
  

  
  return (
    <main className="main-content">
      <h2>admin Dashbored</h2>
      <div className="card-grid">
        <StatCard title="total Products" value={totalProduct} />
        <StatCard title="total Orders" value={totalOrders} />
<StatCard title="total Revenue" value={`$${revenue.toFixed(2)}`} />   
   
    </div>
      <OrderStatus orders={productsOrders} />

    </main>
  );

}

export default MainContent;
