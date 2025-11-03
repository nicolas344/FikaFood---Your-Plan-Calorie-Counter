import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ClipboardList, X } from "lucide-react";
import { Link } from "react-router-dom";
import mealPlanService from "../services/MealPlanService";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const MealPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pdfStyle, setPdfStyle] = useState("simple");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    setError("");
    const result = await mealPlanService.getMealPlans();
    if (result.success) {
      setPlans(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    const result = await mealPlanService.generate();
    if (result.success) {
      setNewPlan(result.data);
      setSuccessMessage("✅ Nuevo plan generado correctamente");
      await loadPlans();
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleViewPlan = async (id) => {
    setLoading(true);
    setError("");
    const result = await mealPlanService.getMealPlan(id);
    if (result.success) {
      setSelectedPlan(result.data);
      setPdfStyle("simple");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este plan?")) return;
    setLoading(true);
    setError("");
    const result = await mealPlanService.deleteMealPlan(id);
    if (result.success) {
      setPlans(plans.filter((plan) => plan.id !== id));
      setSuccessMessage(`🗑️ Plan #${id} eliminado correctamente`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDownloadPdf = async () => {
    if (!selectedPlan) return;
    setDownloading(true);
    setError("");
    const result = await mealPlanService.downloadMealPlanPdf(
      selectedPlan.id,
      pdfStyle
    );

    if (result.success) {
      const blob = result.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result.filename || `plan_${selectedPlan.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccessMessage("📄 PDF descargado correctamente");
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setError(result.error);
    }

    setDownloading(false);
  };

  const handleCloseDetail = () => {
    setSelectedPlan(null);
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Planes Alimenticios
                </h1>
                <p className="text-sm text-gray-600">
                  Genera y consulta tus planes semanales con IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Alertas */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {/* Botón generar */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generar nuevo plan
          </Button>
        </div>

        {/* Nuevo plan */}
        {newPlan && (
          <div className="border border-green-200 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
              <ClipboardList className="w-5 h-5" />
              Nuevo plan generado
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {Object.entries(newPlan.plan).map(([dia, comidas]) => {
                if (dia === "nota") return null;
                return (
                  <div
                    key={dia}
                    className="p-4 border rounded-xl bg-gray-50 shadow-sm"
                  >
                    <h4 className="text-lg font-semibold text-green-700 mb-2">
                      {dia}
                    </h4>
                    <p>
                      <strong>🥞 Desayuno:</strong> {comidas.desayuno}
                    </p>
                    <p>
                      <strong>🍛 Almuerzo:</strong> {comidas.almuerzo}
                    </p>
                    <p>
                      <strong>🍽 Cena:</strong> {comidas.cena}
                    </p>
                  </div>
                );
              })}

              {newPlan.plan.nota && (
                <div className="mt-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <h4 className="font-semibold text-yellow-700 mb-2">
                    📌 Nota importante
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {newPlan.plan.nota}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lista de planes */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📚 Mis Planes
          </h2>
          {loading && plans.length === 0 && <p>Cargando...</p>}
          {!loading && plans.length === 0 && (
            <p className="text-gray-500">No tienes planes aún.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    Plan #{plan.id}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPlan(plan.id)}
                    >
                      Ver detalle
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(plan.created_at).toLocaleString()}
                </p>
                <p className="text-sm">
                  Rango: {plan.start_date} → {plan.end_date}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Panel de detalle */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={handleCloseDetail}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Detalle del Plan #{selectedPlan.id}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Creado: {new Date(selectedPlan.created_at).toLocaleString()}
              </p>
              <p className="text-sm mb-4">
                Rango: {selectedPlan.start_date} → {selectedPlan.end_date}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <label className="flex flex-col text-sm text-gray-600">
                  <span className="font-medium text-gray-700 mb-1">Formato de PDF</span>
                  <select
                    value={pdfStyle}
                    onChange={(event) => setPdfStyle(event.target.value)}
                    className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  >
                    <option value="simple">Simple</option>
                    <option value="estilizado">Estilizado</option>
                  </select>
                </label>
                <Button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="flex items-center gap-2"
                >
                  {downloading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Descargar PDF
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedPlan.plan).map(([dia, comidas]) => {
                  if (dia === "nota") return null;
                  return (
                    <div
                      key={dia}
                      className="p-4 border rounded-xl bg-gray-50 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-green-700 mb-2">
                        {dia}
                      </h4>
                      <p>
                        <strong>🥞 Desayuno:</strong> {comidas.desayuno}
                      </p>
                      <p>
                        <strong>🍛 Almuerzo:</strong> {comidas.almuerzo}
                      </p>
                      <p>
                        <strong>🍽 Cena:</strong> {comidas.cena}
                      </p>
                    </div>
                  );
                })}

                {selectedPlan.plan.nota && (
                  <div className="mt-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                    <h4 className="font-semibold text-yellow-700 mb-2">
                      📌 Nota importante
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedPlan.plan.nota}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealPlanPage;
