package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.math.BigDecimal; // IMPORTAR
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gs_endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private Long idEndereco;

    @Column(name = "cep", length = 9, nullable = false)
    private String cep;

    @Column(name = "numero", nullable = false)
    private int numero;

    @Column(name = "logradouro", length = 255, nullable = false)
    private String logradouro;

    @Column(name = "bairro", length = 255, nullable = false)
    private String bairro;

    @Column(name = "localidade", length = 100, nullable = false)
    private String localidade;

    @Column(name = "uf", length = 2, nullable = false)
    private String uf;

    @Column(name = "complemento", length = 255, nullable = false)
    private String complemento;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude; // ALTERADO para BigDecimal

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude; // ALTERADO para BigDecimal

    @ManyToMany(mappedBy = "enderecos", fetch = FetchType.LAZY)
    private Set<Cliente> clientes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "gs_enderecoeventos",
            joinColumns = @JoinColumn(name = "gs_endereco_id_endereco", referencedColumnName = "id_endereco"),
            inverseJoinColumns = @JoinColumn(name = "gs_eonet_id_eonet", referencedColumnName = "id_eonet"))
    private Set<EonetEventos> eonetEventos = new HashSet<>();

    public Endereco() {
    }

    // Construtor atualizado para BigDecimal
    public Endereco(String cep, int numero, String logradouro, String bairro, String localidade, String uf, String complemento, BigDecimal latitude, BigDecimal longitude) {
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

    // Getters e Setters
    public Long getIdEndereco() { return idEndereco; }
    public void setIdEndereco(Long idEndereco) { this.idEndereco = idEndereco; }
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

    // Getters e Setters para latitude e longitude atualizados
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Set<Cliente> getClientes() {
        return clientes;
    }

    Set<Cliente> getClientesInternal() { return clientes; }
    protected void setClientes(Set<Cliente> clientes) { this.clientes = clientes; }

    public Set<EonetEventos> getEonetEventos() { return eonetEventos; }
    public void setEonetEventos(Set<EonetEventos> eonetEventos) { this.eonetEventos = eonetEventos; }

    public void addEonetEvento(EonetEventos evento) {
        this.eonetEventos.add(evento);
        if (evento != null && evento.getEnderecosEnvolvidosInternal() != null) {
            evento.getEnderecosEnvolvidosInternal().add(this);
        }
    }
    public void removeEonetEvento(EonetEventos evento) {
        this.eonetEventos.remove(evento);
        if (evento != null && evento.getEnderecosEnvolvidosInternal() != null) {
            evento.getEnderecosEnvolvidosInternal().remove(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Endereco endereco = (Endereco) o;
        return idEndereco != null && idEndereco.equals(endereco.idEndereco);
    }

    @Override
    public int hashCode() {
        return idEndereco != null ? Objects.hash(idEndereco) : super.hashCode();
    }

    @Override
    public String toString() {
        return "Endereco{" +
                "idEndereco=" + idEndereco +
                ", cep='" + cep + '\'' +
                ", logradouro='" + logradouro + '\'' +
                ", numero=" + numero +
                ", localidade='" + localidade + '\'' +
                ", uf='" + uf + '\'' +
                ", latitude=" + latitude + // Adicionado para melhor visualização
                ", longitude=" + longitude + // Adicionado para melhor visualização
                '}';
    }
}