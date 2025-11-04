import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/External/productos/")
      .then((res) => {
        setProducts(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>{t('apiProducts.loading')}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{t('apiProducts.title')}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
            <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <h3>{p.name}</h3>
            <p>{t('apiProducts.category')}: {p.category}</p>
            <p>{t('apiProducts.price')}: ${p.price}</p>
            <a href={p.detail_url} target="_blank" rel="noreferrer">
              {t('apiProducts.viewDetail')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
