package br.com.fiap.gs.gsapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public class ClienteRequestDTO {

    @NotBlank(message = "O nome não pode estar em branco.")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
    private String nome;

    @NotBlank(message = "O sobrenome não pode estar em branco.")
    @Size(min = 2, max = 100, message = "O sobrenome deve ter entre 2 e 100 caracteres.")
    private String sobrenome;

    // Para dataNascimento, se fosse LocalDate:
    // @NotNull(message = "A data de nascimento não pode ser nula.")
    // @PastOrPresent(message = "A data de nascimento deve ser no passado ou presente.")
    // private LocalDate dataNascimento;

    @NotBlank(message = "A data de nascimento não pode estar em branco.")
    @Pattern(regexp = "^\\d{2}/\\d{2}/\\d{4}$", message = "A data de nascimento deve estar no formato dd/MM/yyyy.")
    private String dataNascimento; // Mantendo como String por ora, conforme entidade

    @NotBlank(message = "O documento não pode estar em branco.")
    @Size(min = 11, max = 18, message = "O documento deve ter entre 11 (CPF) e 18 (CNPJ com máscara) caracteres.")
    // Poderia adicionar @Pattern para CPF/CNPJ aqui se necessário
    private String documento;

    // IDs dos contatos e endereços existentes a serem associados
    // Ou, se for para criar contatos/endereços junto com cliente, seriam DTOs de Contato/Endereco aqui
    private List<Long> contatosIds;
    private List<Long> enderecosIds;


    // Construtor Padrão (necessário para desserialização)
    public ClienteRequestDTO() {
    }

    // Construtor com todos os campos
    public ClienteRequestDTO(String nome, String sobrenome, String dataNascimento, String documento, List<Long> contatosIds, List<Long> enderecosIds) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.documento = documento;
        this.contatosIds = contatosIds;
        this.enderecosIds = enderecosIds;
    }


    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public List<Long> getContatosIds() {
        return contatosIds;
    }

    public void setContatosIds(List<Long> contatosIds) {
        this.contatosIds = contatosIds;
    }

    public List<Long> getEnderecosIds() {
        return enderecosIds;
    }

    public void setEnderecosIds(List<Long> enderecosIds) {
        this.enderecosIds = enderecosIds;
    }
}