"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function ProductSelector({ selected, onChange }) {
  const [productInput, setProductInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Busca os produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/products/findAll");
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();
        // Filtra produtos não deletados e mapeia para o formato esperado
        const activeProducts = data
          .filter((product) => !product.isDeleted)
          .map((product) => ({
            id: product.id,
            name: product.productName,
            price: 0, // Inicializa o preço como 0 (pode ser alterado depois)
          }));

        setProducts(activeProducts);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  function handleAdd() {
    if (!productInput) return;

    // Se for um produto existente (selecionado da lista)
    if (selectedProduct && typeof selectedProduct !== "string") {
      const finalProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        qty: Number(qty),
        price: Number(price || 0),
      };

      onChange([...selected, finalProduct]);
    }
    // Se for um produto manual (digitado)
    else {
      const finalProduct = {
        id: null, // Indica que é um produto manual
        name: productInput,
        qty: Number(qty),
        price: Number(price || 0),
        isCustom: true, // Marca como produto customizado
      };

      onChange([...selected, finalProduct]);
    }

    // Limpa campos
    setProductInput("");
    setSelectedProduct(null);
    setQty(1);
    setPrice("");
  }

  function updateQty(id, qty) {
    onChange(
      selected.map((p) => (p.id === id ? { ...p, qty: Number(qty) } : p))
    );
  }

  function updatePrice(id, price) {
    onChange(
      selected.map((p) => (p.id === id ? { ...p, price: Number(price) } : p))
    );
  }

  function removeProduct(id) {
    onChange(selected.filter((p) => p.id !== id));
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <div className="mt-4">
        <h3 className="font-bold mb-4 p-2">Adicionar Produto</h3>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <Autocomplete
            freeSolo
            fullWidth
            options={products}
            loading={loading}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            inputValue={productInput}
            onInputChange={(e, val) => setProductInput(val)}
            onChange={(e, val) => {
              setSelectedProduct(val);
              if (val && typeof val !== "string") {
                // Pode definir um preço padrão aqui se quiser
                // setPrice(val.defaultPrice || 0);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Produto"
                sx={{
                  input: { color: "#000" },
                  label: {
                    color: "white",
                    transform: "translate(18px, -20px) scale(0.90)",
                  },
                  backgroundColor: "#fff",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={
              loading ? "Carregando..." : "Nenhum produto encontrado"
            }
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              if (typeof option === "string" || typeof value === "string") {
                return option === value;
              }
              return option.id === value.id;
            }}
          />

          <TextField
            label="Quantidade"
            type="number"
            value={qty}
            onChange={(e) => {
              const val = Math.max(0, Number(e.target.value));
              setQty(isNaN(val) ? 0 : val);
            }}
            inputProps={{ min: 0 }}
            sx={{
              input: { color: "#000" },
              label: {
                color: "white",
                transform: "translate(18px, -20px) scale(0.90)",
              },
              backgroundColor: "#fff",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
            }}
          />

          <TextField
            label="Valor Unitário (R$)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            inputProps={{ min: 0, step: "0.01" }}
            sx={{
              input: { color: "#000" },
              label: {
                color: "white",
                transform: "translate(18px, -20px) scale(0.90)",
              },
              backgroundColor: "#fff",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
            }}
          />
        </div>

        <Button variant="contained" onClick={handleAdd}>
          Adicionar
        </Button>

        <h4 className="mt-6 font-medium">Selecionados:</h4>
        <ul className="mt-2">
          {selected.map((p) => (
            <li key={p.id || p.name} className="mb-2">
              <div className="flex items-center gap-2">
                <span className="w-40">{p.name}</span>
                <TextField
                  label="Qtd"
                  type="number"
                  value={p.qty}
                  onChange={(e) => updateQty(p.id, e.target.value)}
                  sx={{ width: 80, backgroundColor: "#fff" }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Valor"
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePrice(p.id, e.target.value)}
                  sx={{ width: 120, backgroundColor: "#fff" }}
                  inputProps={{ min: 0, step: "0.01" }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeProduct(p.id)}
                >
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ThemeProvider>
  );
}
