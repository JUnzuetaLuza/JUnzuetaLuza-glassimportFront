import { useState, useEffect } from "react";

export function useVehiculos() {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loadingModelos, setLoadingModelos] = useState(false);

  useEffect(() => {
    fetch("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
      .then(res => res.json())
      .then(data => setMarcas(data.Results.map(m => m.Make_Name).sort()))
      .catch(() => setMarcas([]));
  }, []);

  const cargarModelos = (marca) => {
    setLoadingModelos(true);
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(marca)}?format=json`)
      .then(res => res.json())
      .then(data => setModelos(data.Results.map(m => m.Model_Name).sort()))
      .catch(() => setModelos([]))
      .finally(() => setLoadingModelos(false));
  };

  return { marcas, modelos, cargarModelos, loadingModelos };
}