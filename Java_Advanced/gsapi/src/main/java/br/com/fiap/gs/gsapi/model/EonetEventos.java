package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.time.Instant; // Correto para TIMESTAMP WITH LOCAL TIME ZONE
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "gs_eonet")
public class EonetEventos {

    @Id
    @SequenceGenerator(name = "gs_eonet_seq", sequenceName = "gs_eonet_id_eonet_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gs_eonet_seq")
    @Column(name = "id_eonet") // PK numérica interna
    private long idEonet;

    @Lob // Indica que é um Large Object, mapeando para CLOB para String
    @Column(name = "json", nullable = true) // Nome da coluna no DDL é "json"
    private String jsonEvento; // Nome do campo na sua classe

    @Column(name = "data", nullable = true) // Mapeia para TIMESTAMP WITH LOCAL TIME ZONE
    private Instant data;

    @Column(name = "eonet_id", length = 50, nullable = false, unique = true) // ID original da API EONET
    private String eonetApiId; // Nome do campo na sua classe era "eonetId"

    @ManyToMany(mappedBy = "eonetEventos", fetch = FetchType.LAZY) // Mapeado pelo campo "eonetEventos" em Endereco
    private Set<Endereco> enderecosEnvolvidos = new HashSet<>();

    public EonetEventos() {
    }

    public EonetEventos(String jsonEvento, Instant data, String eonetApiId) {
        this.jsonEvento = jsonEvento;
        this.data = data;
        this.eonetApiId = eonetApiId;
    }

    // Getters e Setters

    public long getIdEonet() { return idEonet; }
    public void setIdEonet(long idEonet) { this.idEonet = idEonet; }
    public String getJsonEvento() { return jsonEvento; }
    public void setJsonEvento(String jsonEvento) { this.jsonEvento = jsonEvento; }
    public Instant getData() { return data; }
    public void setData(Instant data) { this.data = data; }
    public String getEonetApiId() { return eonetApiId; } // Ajustado para eonetApiId
    public void setEonetApiId(String eonetApiId) { this.eonetApiId = eonetApiId; } // Ajustado para eonetApiId
    public Set<Endereco> getEnderecosEnvolvidos() { return enderecosEnvolvidos; }
    public void setEnderecosEnvolvidos(Set<Endereco> enderecosEnvolvidos) { this.enderecosEnvolvidos = enderecosEnvolvidos; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EonetEventos that = (EonetEventos) o;
        return idEonet != 0 && idEonet == that.idEonet;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEonet);
    }
}