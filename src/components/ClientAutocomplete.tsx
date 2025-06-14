"use client";
import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function ClientAutocomplete({ onSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/usuario/findAll");
        if (!response.ok) throw new Error("Erro na requisição");

        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <Autocomplete
        freeSolo
        fullWidth
        options={options}
        loading={loading}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          return option?.name || ""; // Acessa a propriedade name do cliente
        }}
        value={selectedClient}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedClient(newValue);
          if (newValue && typeof newValue !== "string") {
            onSelect(newValue);
          } else {
            onSelect({ id: null, name: newValue });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar ou digitar cliente"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
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
        noOptionsText={loading ? "Carregando..." : "Nenhum cliente encontrado"}
        isOptionEqualToValue={(option, value) => {
          // Comparação segura considerando que value pode ser string ou objeto
          if (!option || !value) return false;
          if (typeof option === "string" || typeof value === "string") {
            return option === value;
          }
          return option.id === value.id;
        }}
        filterOptions={(options, state) => {
          // Filtro personalizado para buscar pelo nome
          const input = state.inputValue.toLowerCase();
          return options.filter((option) =>
            option.name.toLowerCase().includes(input)
          );
        }}
      />
    </ThemeProvider>
  );
}
