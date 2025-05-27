package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "gs_endereco")
public class Endereco {

    @Id
    @SequenceGenerator(name = "gs_endereco_seq", sequenceName = "gs_endereco_id_endereco_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gs_endereco_seq")
    @Column(name = "id_endereco")
    private long idEndereco;

    @Column(name = "cep", length = 9, nullable = false)
    private String cep;

    @Column(name = "numero", nullable = false) // DDL tem NUMBER(5)
    private int numero;

    @Column(name = "logradouro", length = 255, nullable = false)
    private String logradouro;

    @Column(name = "bairro", length = 255, nullable = false)
    private String bairro;

    @Column(name = "localidade", length = 100, nullable = false)
    private String localidade;

    @Column(name = "uf", length = 2, nullable = false)
    private String uf;

    @Column(name = "complemento", length = 255, nullable = false) // Corrigido de "complemente"
    private String complemento;

    @Column(name = "latitude", nullable = false) // DDL tem NUMBER(10,7)
    private double latitude;

    @Column(name = "longitude", nullable = false) // DDL tem NUMBER(10,7)
    private double longitude;

    @ManyToMany(mappedBy = "enderecos", fetch = FetchType.LAZY) // Mapeado pelo campo "enderecos" em Cliente
    private Set<Cliente> clientes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "gs_enderecoeventos",
            joinColumns = @JoinColumn(name = "gs_endereco_id_endereco"),
            inverseJoinColumns = @JoinColumn(name = "gs_eonet_id_eonet") // Este FK em gs_enderecoeventos refere-se ao ID numérico da gs_eonet
    )
    private Set<EonetEventos> eonetEventos = new HashSet<>(); // Alterado para uma coleção

    public Endereco() {
    }

    // Construtor ajustado
    public Endereco(String cep, int numero, String logradouro, String bairro, String localidade, String uf, String complemento, double latitude, double longitude) {
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

    // Getters e Setters (incluindo para as coleções)

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
    public String getComplemento() { return complemento; } // Corrigido
    public void setComplemento(String complemento) { this.complemento = complemento; } // Corrigido
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public Set<Cliente> getClientes() { return clientes; }
    public void setClientes(Set<Cliente> clientes) { this.clientes = clientes; }
    public Set<EonetEventos> getEonetEventos() { return eonetEventos; }
    public void setEonetEventos(Set<EonetEventos> eonetEventos) { this.eonetEventos = eonetEventos; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Endereco endereco = (Endereco) o;
        return idEndereco != 0 && idEndereco == endereco.idEndereco;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEndereco);
    }
}