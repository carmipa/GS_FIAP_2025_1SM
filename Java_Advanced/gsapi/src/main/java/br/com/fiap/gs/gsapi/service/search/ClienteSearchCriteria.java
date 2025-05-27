// Pacote: br.com.fiap.gs.gsapi.service.search
package br.com.fiap.gs.gsapi.service.search;

import java.util.Objects;

// Classe simples para encapsular critérios de busca para Cliente
public class ClienteSearchCriteria {
    private String nome;
    private String documento;
    private String dataNascimento; // Poderia ser LocalDate se o DTO e a entidade usassem

    public ClienteSearchCriteria() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ClienteSearchCriteria that = (ClienteSearchCriteria) o;
        return Objects.equals(nome, that.nome) &&
                Objects.equals(documento, that.documento) &&
                Objects.equals(dataNascimento, that.dataNascimento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, documento, dataNascimento);
    }
}
