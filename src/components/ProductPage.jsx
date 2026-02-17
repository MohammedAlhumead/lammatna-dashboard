import { useState } from "react";
function ProductPage({products, setProducts}) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        active: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);


    const handleSubmit = (e) => {
  e.preventDefault();

  if (editingProduct) {
    setProducts(
      products.map((item) =>
        item.id === editingProduct
          ? {
              ...item,
              name: formData.name,
              category: formData.category,
              price: formData.price,
              stock: formData.stock,
              active: formData.active === "true",
            }
          : item

      )
    )
  }else {
    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      category: formData.category,
      price: formData.price,
      stock: formData.stock,
      active: formData.stock > 0,
    };
    setProducts([...products, newProduct]);
}
    closeForm();
};


    const deleteProduct = (id) => {
        setProducts(products.filter((alm6rood) => alm6rood.id !== id))
    };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const openAddForm = () => {
        setEditingProduct(null)
        setFormData({ name: "", category: "", price: "", stock: "", active: "" })
        setShowForm(true)
    }
    const openEditForm = (product) => {
        setEditingProduct(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            active: product.active ? "true" : "false",
        });
        setShowForm(true);
    };
    const closeForm = () => {
        setEditingProduct(false)
        setFormData({ name: "", category: "", price: "", stock: "", active: "" })
        setShowForm(false)
    }
    return (
        <>
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    name="active"
                                    value={formData.active}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Out Of Stock</option>
                                </select>
                                <div className="form">
                                    <button type="submit" className="btn-add" >
                                        {editingProduct ?  "Update": "Add"}
                                    </button>
                                    <button
                                        type="close"
                                        className="btn-cancel"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <h2>Products</h2>
                    <button onClick={openAddForm} className="btn-add">Add Product +</button>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.price}</td>
                                <td>{item.stock}</td>
                                <td><span
                                    className={item.active ? "badge active" : "badge inactive"}
                                >
                                    {" "}
                                    {item.active ? "Active" : "Out Of Stock"}
                                </span>
                                </td>
                                <td>
                                    <button className="btn-edit" onClick={() => openEditForm(item)}>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(item.id)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>


                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default ProductPage;