// Pacote: br.com.fiap.gs.gsapi.dto.response
package br.com.fiap.gs.gsapi.dto.response;

import java.math.BigDecimal; // IMPORTAR
import java.util.Set;

public class EnderecoResponseDTO {
    private long idEndereco;
    private String cep;
    private int numero;
    private String logradouro;
    private String bairro;
    private String localidade;
    private String uf;
    private String complemento;
    private BigDecimal latitude;  // ALTERADO para BigDecimal
    private BigDecimal longitude; // ALTERADO para BigDecimal
    private Set<EonetEventoResponseDTO> eonetEventos;

    public EnderecoResponseDTO() {
    }

    // Getters e Setters
    public long getIdEndereco() { return idEndereco; }
    public void setIdEndereco(long idEndereco) { this.idEndereco = idEndereco; }
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
    public BigDecimal getLatitude() { return latitude; } // Tipo de retorno atualizado
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; } // Tipo do parâmetro atualizado
    public BigDecimal getLongitude() { return longitude; } // Tipo de retorno atualizado
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; } // Tipo do parâmetro atualizado
    public Set<EonetEventoResponseDTO> getEonetEventos() { return eonetEventos; }
    public void setEonetEventos(Set<EonetEventoResponseDTO> eonetEventos) { this.eonetEventos = eonetEventos; }
}