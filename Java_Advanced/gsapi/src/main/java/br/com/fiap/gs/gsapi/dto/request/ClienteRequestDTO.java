package br.com.fiap.gs.gsapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set; // Importar Set
import java.util.HashSet; // Importar HashSet

public class ClienteRequestDTO {

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "O sobrenome não pode estar em branco")
    @Size(max = 100, message = "O sobrenome deve ter no máximo 100 caracteres")
    private String sobrenome;

    @NotBlank(message = "A data de nascimento não pode estar em branco")
    @Size(max = 10, message = "A data de nascimento deve ter no máximo 10 caracteres") // Ou use @Pattern para formato
    private String dataNascimento;

    @NotBlank(message = "O documento não pode estar em branco")
    @Size(max = 18, message = "O documento deve ter no máximo 18 caracteres")
    private String documento;

    private ContatoRequestDTO contato; // Ou contatoPrincipal
    private EnderecoRequestDTO endereco; // Ou enderecoPrincipal

    public ClienteRequestDTO() {
    }

    // Construtor, Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getSobrenome() { return sobrenome; }
    public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome; }
    public String getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public ContatoRequestDTO getContato() {
        return contato;
    }

    public void setContato(ContatoRequestDTO contato) {
        this.contato = contato;
    }

    public EnderecoRequestDTO getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoRequestDTO endereco) {
        this.endereco = endereco;
    }
}