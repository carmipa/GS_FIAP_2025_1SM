// Pacote: br.com.fiap.gs.gsapi.dto.request

package br.com.fiap.gs.gsapi.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EnderecoRequestDTO {

    @NotBlank(message = "O CEP não pode estar em branco")
    @Size(min = 8, max = 9, message = "O CEP deve ter entre 8 e 9 caracteres (ex: 00000-000 ou 00000000)")
    private String cep;

    @NotNull(message = "O número não pode ser nulo")
    @Min(value = 1, message = "O número deve ser no mínimo 1")
    @Max(value = 99999, message = "O número deve ser no máximo 99999") // Conforme DDL NUMBER(5)
    private int numero;

    @NotBlank(message = "O logradouro não pode estar em branco")
    @Size(max = 255, message = "O logradouro deve ter no máximo 255 caracteres")
    private String logradouro;

    @NotBlank(message = "O bairro não pode estar em branco")
    @Size(max = 255, message = "O bairro deve ter no máximo 255 caracteres")
    private String bairro;

    @NotBlank(message = "A localidade não pode estar em branco")
    @Size(max = 100, message = "A localidade deve ter no máximo 100 caracteres")
    private String localidade;

    @NotBlank(message = "A UF não pode estar em branco")
    @Size(min = 2, max = 2, message = "A UF deve ter 2 caracteres")
    private String uf;

    @Size(max = 255, message = "O complemento deve ter no máximo 255 caracteres")
    private String complemento; // Complemento é opcional

    @NotNull(message = "A latitude não pode ser nula")
    @DecimalMin(value = "-90.0", message = "Latitude mínima é -90.0")
    @DecimalMax(value = "90.0", message = "Latitude máxima é 90.0")
    @Digits(integer = 3, fraction = 7, message = "Latitude deve ter até 3 dígitos inteiros e 7 fracionários") // Para NUMBER(10,7)
    private Double latitude;

    @NotNull(message = "A longitude não pode ser nula")
    @DecimalMin(value = "-180.0", message = "Longitude mínima é -180.0")
    @DecimalMax(value = "180.0", message = "Longitude máxima é 180.0")
    @Digits(integer = 3, fraction = 7, message = "Longitude deve ter até 3 dígitos inteiros e 7 fracionários") // Para NUMBER(10,7)
    private Double longitude;

    public EnderecoRequestDTO() {
    }

    public EnderecoRequestDTO(String cep, int numero, String logradouro, String bairro, String localidade, String uf, String complemento, Double latitude, Double longitude) {
        this.cep = cep;
        this.numero = numero;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.complemento = complemento;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getLocalidade() { return localidade; }
    public void setLocalidade(String localidade) { this.localidade = localidade; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
