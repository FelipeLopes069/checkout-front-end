"use client"; // Habilita funcionalidades do React no lado do cliente

import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaClipboard } from "react-icons/fa";
import api from "../api/api";
import "../styles/produtos.css";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", imagem: "" });
  const [preview, setPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await api.get("/api/products");
      setProdutos(data);
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("imagem", file);

    try {
      setCarregando(true);
      const data = await api.upload("/api/products/upload", formData);
      setForm((prev) => ({ ...prev, imagem: data.url }));
    } catch (err) {
      console.error("❌ Erro ao fazer upload:", err.message);
      setErro("Erro ao fazer upload da imagem");
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalEdicao = (produto) => {
    setProdutoEditando(produto._id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
    });
    setPreview(produto.imagem);
    setModoEdicao(true);
    setMostrarModal(true);
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (modoEdicao && produtoEditando) {
        await api.put(`/api/products/${produtoEditando}`, {
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          imagem: form.imagem,
        });
      } else {
        await api.post("/api/products", {
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          imagem: form.imagem,
        });
      }

      carregarProdutos();
      setForm({ nome: "", descricao: "", preco: "", imagem: "" });
      setPreview(null);
      setMostrarModal(false);
      setModoEdicao(false);
      setProdutoEditando(null);
    } catch (err) {
      console.error("❌ Erro ao salvar produto:", err.message);
      setErro("Erro ao salvar produto");
    }
  };

  const excluirProduto = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProdutos(produtos.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Erro ao excluir produto:", err.message);
    }
  };

  const copiarLinkDeVenda = async (uuid) => {
    try {
      const link = `${window.location.origin}/buy/${uuid}`;
      await navigator.clipboard.writeText(link);
      alert("🔗 Link de venda copiado!");
    } catch (err) {
      console.error("❌ Erro ao copiar link:", err.message);
    }
  };

  const getImagemUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x200.png?text=Produto";

    const backendBaseURL =
      typeof window !== "undefined" && window.location.origin.includes("localhost")
        ? "http://localhost:5000"
        : "https://coloured-siana-fynancce-v2-8cb1dd20.koyeb.app";

    return url.startsWith("http") ? url : `${backendBaseURL}${url}`;
  };

  const getLinkPublico = (uuid) => {
    return `${window.location.origin}/buy/${uuid}`;
  };

  return (
    <main className="pagina-produtos">
      <div className="produtos-topo">
        <h1 className="produtos-titulo">Seus Produtos</h1>
        <button
          className="botao-novo"
          onClick={() => {
            setMostrarModal(true);
            setModoEdicao(false);
            setForm({ nome: "", descricao: "", preco: "", imagem: "" });
            setPreview(null);
          }}
        >
          + Novo Produto
        </button>
      </div>

      <div className="grid-produtos">
        {produtos.length === 0 && (
          <p style={{ color: "#ccc", marginTop: "20px" }}>
            Nenhum produto cadastrado.
          </p>
        )}
        {produtos.map((produto) => (
          <div key={produto._id} className="card-produto">
            <img
              src={getImagemUrl(produto.imagem)}
              alt={produto.nome}
              className="produto-imagem"
            />
            <h3 className="produto-nome">{produto.nome}</h3>
            <p className="produto-descricao">{produto.descricao}</p>
            <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>

            {produto.uuid && (
              <a
                href={getLinkPublico(produto.uuid)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-publico"
              >
                Acessar página pública ↗
              </a>
            )}

            <div className="acoes-produto">
              <button className="botao-editar" onClick={() => abrirModalEdicao(produto)}>
                <FaEdit style={{ marginRight: 6 }} /> Editar
              </button>
              <button className="botao-deletar" onClick={() => excluirProduto(produto._id)}>
                <FaTrash style={{ marginRight: 6 }} /> Excluir
              </button>
              <button className="botao-editar" onClick={() => copiarLinkDeVenda(produto.uuid)}>
                <FaClipboard style={{ marginRight: 6 }} /> Copiar Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modoEdicao ? "Editar Produto" : "Novo Produto"}</h2>
            <form onSubmit={salvarProduto} className="form-modal">
              <input
                type="text"
                name="nome"
                placeholder="Nome do produto"
                value={form.nome}
                onChange={handleChange}
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={form.descricao}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="preco"
                placeholder="Preço"
                step="0.01"
                value={form.preco}
                onChange={handleChange}
                required
              />
              <input type="file" accept="image/*" onChange={handleImagem} />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    marginTop: "10px",
                    borderRadius: "8px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    border: "1px solid #444",
                  }}
                />
              )}
              {erro && <p className="erro">{erro}</p>}
              <div className="botoes-modal">
                <button type="submit" className="btn-confirmar" disabled={carregando}>
                  {carregando ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}