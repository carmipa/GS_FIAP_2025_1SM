// Pacote: br.com.fiap.gs.gsapi.dto.response

package br.com.fiap.gs.gsapi.dto.response;

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
    private double latitude;
    private double longitude;
    private Set<EonetEventoResponseDTO> eonetEventos; // Assumindo que você terá um DTO para EonetEventos

    public EnderecoResponseDTO() {
    }

    // Construtor, Getters e Setters
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
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public Set<EonetEventoResponseDTO> getEonetEventos() { return eonetEventos; }
    public void setEonetEventos(Set<EonetEventoResponseDTO> eonetEventos) { this.eonetEventos = eonetEventos; }
}
