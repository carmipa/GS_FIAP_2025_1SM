package br.com.fiap.gs.gsapi.dto.response;

import java.util.Set;
// Supondo que você também crie ContatoResponseDTO e EnderecoResponseDTO
// import br.com.fiap.gs.gsapi.dto.ContatoResponseDTO;
// import br.com.fiap.gs.gsapi.dto.EnderecoResponseDTO;

public class ClienteResponseDTO {
    private long idCliente;
    private String nome;
    private String sobrenome;
    private String dataNascimento;
    private String documento;
    private Set<ContatoResponseDTO> contatos;   // Usar DTOs para objetos aninhados
    private Set<EnderecoResponseDTO> enderecos; // Usar DTOs para objetos aninhados

    public ClienteResponseDTO() {
    }

    // Construtor, Getters e Setters
    public long getIdCliente() { return idCliente; }
    public void setIdCliente(long idCliente) { this.idCliente = idCliente; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getSobrenome() { return sobrenome; }
    public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome; }
    public String getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public Set<ContatoResponseDTO> getContatos() { return contatos; }
    public void setContatos(Set<ContatoResponseDTO> contatos) { this.contatos = contatos; }
    public Set<EnderecoResponseDTO> getEnderecos() { return enderecos; }
    public void setEnderecos(Set<EnderecoResponseDTO> enderecos) { this.enderecos = enderecos; }
}