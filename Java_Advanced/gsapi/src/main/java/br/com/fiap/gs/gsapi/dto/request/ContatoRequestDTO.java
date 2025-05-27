// Pacote: br.com.fiap.gs.gsapi.dto.request

package br.com.fiap.gs.gsapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContatoRequestDTO {

    @NotBlank(message = "O DDD não pode estar em branco")
    @Size(min = 2, max = 3, message = "O DDD deve ter entre 2 e 3 caracteres")
    private String ddd;

    @NotBlank(message = "O telefone não pode estar em branco")
    @Size(min = 8, max = 15, message = "O telefone deve ter entre 8 e 15 caracteres")
    @Pattern(regexp = "^[0-9]+$", message = "O telefone deve conter apenas números")
    private String telefone;

    @Size(min = 9, max = 15, message = "O celular deve ter entre 9 e 15 caracteres")
    @Pattern(regexp = "^[0-9]+$", message = "O celular deve conter apenas números")
    private String celular; // Pode ser opcional dependendo da regra de negócio

    @Size(min = 9, max = 15, message = "O WhatsApp deve ter entre 9 e 15 caracteres")
    @Pattern(regexp = "^[0-9]+$", message = "O WhatsApp deve conter apenas números")
    private String whatsapp; // Pode ser opcional

    @NotBlank(message = "O email não pode estar em branco")
    @Email(message = "Formato de email inválido")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres")
    private String email;

    @NotBlank(message = "O tipo de contato não pode estar em branco")
    @Size(max = 50, message = "O tipo de contato deve ter no máximo 50 caracteres")
    private String tipoContato;

    public ContatoRequestDTO() {
    }

    public ContatoRequestDTO(String ddd, String telefone, String celular, String whatsapp, String email, String tipoContato) {
        this.ddd = ddd;
        this.telefone = telefone;
        this.celular = celular;
        this.whatsapp = whatsapp;
        this.email = email;
        this.tipoContato = tipoContato;
    }

    public String getDdd() {
        return ddd;
    }

    public void setDdd(String ddd) {
        this.ddd = ddd;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipoContato() {
        return tipoContato;
    }

    public void setTipoContato(String tipoContato) {
        this.tipoContato = tipoContato;
    }
}
