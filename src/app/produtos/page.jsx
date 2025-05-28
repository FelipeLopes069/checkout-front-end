"use client"; // Habilita funcionalidades do React no lado do cliente

// Importações de dependências e estilos
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaClipboard } from "react-icons/fa";
import api from "../api/api";
import "../styles/produtos.css";

export default function ProdutosPage() {
  // Estados principais
  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [mostrarModal, setMostrarModal] = useState(false); // Controle do modal
  const [modoEdicao, setModoEdicao] = useState(false); // Alterna entre criar ou editar produto
  const [produtoEditando, setProdutoEditando] = useState(null); // ID do produto em edição
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", imagem: "" }); // Dados do formulário
  const [preview, setPreview] = useState(null); // Preview da imagem
  const [erro, setErro] = useState(""); // Erro do formulário
  const [carregando, setCarregando] = useState(false); // Estado de carregamento

  // Ao carregar a página, busca os produtos
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

  // Atualiza o estado do form ao digitar
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload de imagem com preview e envio ao backend
  const handleImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // Mostra preview
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

  // Abre o modal para editar um produto existente
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

  // Salva produto novo ou edita existente
  const salvarProduto = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (modoEdicao && produtoEditando) {
        // Atualiza produto
        await api.put(`/api/products/${produtoEditando}`, {
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          imagem: form.imagem,
        });
      } else {
        // Cria novo produto
        await api.post("/api/products", {
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          imagem: form.imagem,
        });
      }

      // Limpa estados e fecha modal
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

  // Exclui produto
  const excluirProduto = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProdutos(produtos.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Erro ao excluir produto:", err.message);
    }
  };

  // Copia link público de venda para área de transferência
  const copiarLinkDeVenda = async (uuid) => {
    try {
      const link = `${window.location.origin}/buy/${uuid}`;
      await navigator.clipboard.writeText(link);
      alert("🔗 Link de venda copiado!");
    } catch (err) {
      console.error("❌ Erro ao copiar link:", err.message);
    }
  };

  // Garante exibição correta da imagem
  const getImagemUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x200.png?text=Produto";
    return url.startsWith("http") ? url : `http://localhost:5000${url}`;
  };

  // Gera link público do produto
  const getLinkPublico = (uuid) => {
    return `http://localhost:3000/buy/${uuid}`;
  };

  return (
    <main className="pagina-produtos">
      {/* Cabeçalho com botão para adicionar novo produto */}
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

      {/* Lista de produtos */}
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

      {/* Modal de criação/edição */}
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