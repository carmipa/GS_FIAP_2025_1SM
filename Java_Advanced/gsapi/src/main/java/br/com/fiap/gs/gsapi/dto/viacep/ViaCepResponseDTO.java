// Pacote: br.com.fiap.gs.gsapi.dto.viacep
package br.com.fiap.gs.gsapi.dto.viacep;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// Ignora propriedades desconhecidas no JSON para evitar erros de deserialização
@JsonIgnoreProperties(ignoreUnknown = true)
public class ViaCepResponseDTO {

    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;
    private String localidade; // Cidade
    private String uf;         // Estado
    private String ibge;
    private String gia;
    private String ddd;
    private String siafi;

    @JsonProperty("erro") // Para mapear o campo "erro" do JSON para o método isErro() / setErro()
    private boolean erro; // ViaCEP retorna erro=true se o CEP não for encontrado

    // Construtor padrão
    public ViaCepResponseDTO() {
    }

    // Getters e Setters para todos os campos
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getLocalidade() { return localidade; }
    public void setLocalidade(String localidade) { this.localidade = localidade; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public String getIbge() { return ibge; }
    public void setIbge(String ibge) { this.ibge = ibge; }
    public String getGia() { return gia; }
    public void setGia(String gia) { this.gia = gia; }
    public String getDdd() { return ddd; }
    public void setDdd(String ddd) { this.ddd = ddd; }
    public String getSiafi() { return siafi; }
    public void setSiafi(String siafi) { this.siafi = siafi; }
    public boolean isErro() { return erro; } // Getter para boolean
    public void setErro(boolean erro) { this.erro = erro; } // Setter para boolean
}
