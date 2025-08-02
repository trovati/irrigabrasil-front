import { useState } from "react";
import ClientAutocomplete from "./ClientAutocomplete";
import PaymentSelector from "./Payment";
import ProductSelector from "./ProductSelector";

export default function OrderForm() {
  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState([]);

  const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  async function handleSubmit() {
    // Verifica se há cliente e produtos selecionados
    if (!client) {
      alert("Selecione um cliente antes de enviar o pedido");
      return;
    }

    if (products.length === 0) {
      alert("Adicione pelo menos um produto ao pedido");
      return;
    }

    if (!payment) {
      alert("Selecione um tipo de pagamento antes de enviar o pedido");
      return;
    }

    // Verifica se há produtos customizados sem ID
    const hasCustomProducts = products.some((p) => p.id === null);
    if (hasCustomProducts) {
      alert(
        "Alguns produtos adicionados manualmente não têm ID. Corrija antes de enviar."
      );
      return;
    }

    // Formata os dados no formato exigido pelo backend
    const payload = {
      products: products.map((p) => ({
        idProduct: p.id, // Usa o ID do produto
        valuePerProduct: p.price,
        quantity: p.qty,
      })),
      payment: payment.idPayment, // Valor fixo como solicitado
      client: client.id, // Assumindo que o cliente tem uma propriedade 'id'
    };

    try {
      const res = await fetch("http://localhost:4000/pedidos/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Pedido criado com sucesso!");
        // Limpa o formulário após sucesso (opcional)
        setClient(null);
        setProducts([]);
      } else {
        const error = await res.json();
        alert(`Erro ao criar pedido: ${error.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error(error);
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ClientAutocomplete onSelect={setClient} />
        <PaymentSelector onSelect={setPayment} />
      </div>

      <ProductSelector selected={products} onChange={setProducts} />

      <div className="mt-4">
        <p>
          <strong>Total:</strong> R$ {total.toFixed(2)}
        </p>
        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enviar Pedido
        </button>
      </div>
    </form>
  );
}