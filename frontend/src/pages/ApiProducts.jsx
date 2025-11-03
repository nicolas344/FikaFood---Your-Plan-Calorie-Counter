
import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/External/productos/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos Api Externa</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
            <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <h3>{p.name}</h3>
            <p>Categoría: {p.category}</p>
            <p>Precio: ${p.price}</p>
            <a href={p.detail_url} target="_blank" rel="noreferrer">
              Ver detalle
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
