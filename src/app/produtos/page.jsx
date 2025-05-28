'use client'; // Habilita a renderização no lado do cliente (obrigatório em componentes com hooks ou interatividade no Next.js App Router)

// Importações de dependências e estilos
import { useEffect, useState } from "react"; // Hooks React para estados e efeitos colaterais
import { FaEdit, FaTrash, FaClipboard } from "react-icons/fa"; // Ícones para ações
import api from "../api/api"; // Instância personalizada do Axios
import "../styles/produtos.css"; // Estilos da página de produtos

// Componente principal da página de produtos
export default function ProdutosPage() {
  // Estados da interface e formulário
  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [mostrarModal, setMostrarModal] = useState(false); // Controle do modal
  const [modoEdicao, setModoEdicao] = useState(false); // Alterna entre criar e editar
  const [produtoEditando, setProdutoEditando] = useState(null); // Produto sendo editado
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", imagem: "" }); // Dados do formulário
  const [preview, setPreview] = useState(null); // Pré-visualização da imagem
  const [erro, setErro] = useState(""); // Mensagens de erro
  const [carregando, setCarregando] = useState(false); // Estado de carregamento

  // Carrega os produtos ao iniciar
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Função para buscar produtos no backend
  const carregarProdutos = async () => {
    try {
      const data = await api.get("/api/products");
      setProdutos(data);
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err.message);
    }
  };

  // Atualiza os campos do formulário conforme digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Lida com o upload da imagem do produto
  const handleImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // Mostra preview local da imagem
    const formData = new FormData();
    formData.append("imagem", file);

    try {
      setCarregando(true);
      const data = await api.upload("/api/products/upload", formData); // Faz upload da imagem
      setForm((prev) => ({ ...prev, imagem: data.url })); // Salva URL no estado
    } catch (err) {
      console.error("❌ Erro ao fazer upload:", err.message);
      setErro("Erro ao fazer upload da imagem");
    } finally {
      setCarregando(false);
    }
  };

  // Abre modal com dados de um produto existente para edição
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

  // Salva produto novo ou atualiza existente
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

      carregarProdutos(); // Recarrega a lista
      setForm({ nome: "", descricao: "", preco: "", imagem: "" }); // Limpa formulário
      setPreview(null);
      setMostrarModal(false);
      setModoEdicao(false);
      setProdutoEditando(null);
    } catch (err) {
      console.error("❌ Erro ao salvar produto:", err.message);
      setErro("Erro ao salvar produto");
    }
  };

  // Exclui um produto da lista
  const excluirProduto = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProdutos(produtos.filter((p) => p._id !== id)); // Remove da UI
    } catch (err) {
      console.error("❌ Erro ao excluir produto:", err.message);
    }
  };

  // Copia link público do produto para a área de transferência
  const copiarLinkDeVenda = async (uuid) => {
    try {
      const link = `${window.location.origin}/buy/${uuid}`;
      await navigator.clipboard.writeText(link);
      alert("🔗 Link de venda copiado!");
    } catch (err) {
      console.error("❌ Erro ao copiar link:", err.message);
    }
  };

  // Gera URL da imagem com fallback e ambiente
  const getImagemUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x200.png?text=Produto";

    const backendBaseURL =
      typeof window !== "undefined" && window.location.origin.includes("localhost")
        ? "http://localhost:5000"
        : "https://coloured-siana-fynancce-v2-8cb1dd20.koyeb.app";

    return url.startsWith("http") ? url : `${backendBaseURL}${url}`;
  };

  // Monta link público da página de venda
  const getLinkPublico = (uuid) => {
    return `${window.location.origin}/buy/${uuid}`;
  };

  // Retorno da interface (JSX)
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

      {/* Modal de criação/edição de produto */}
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