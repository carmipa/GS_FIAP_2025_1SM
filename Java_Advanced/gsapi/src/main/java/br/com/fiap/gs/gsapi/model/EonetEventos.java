package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gs_eonet", uniqueConstraints = {
        @UniqueConstraint(name = "unq_gs_eonet_eonet_api_id", columnNames = {"eonet_id"}) // Nome da coluna no DDL é eonet_id
})
public class EonetEventos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eonet")
    private Long idEonet; // PK numérica interna

    @Column(name = "eonet_id", length = 50, nullable = false) // ID original da API EONET
    private String eonetApiId;

    @Lob
    @Column(name = "json", columnDefinition = "CLOB") // DDL tem CLOB NULL
    private String jsonEvento;

    @Column(name = "data") // DDL tem TIMESTAMP WITH LOCAL TIME ZONE NULL
    private Instant data;

    @ManyToMany(mappedBy = "eonetEventos", fetch = FetchType.LAZY)
    private Set<Endereco> enderecosEnvolvidos = new HashSet<>();

    public EonetEventos() {
    }

    public EonetEventos(String eonetApiId, String jsonEvento, Instant data) {
        this.eonetApiId = eonetApiId;
        this.jsonEvento = jsonEvento;
        this.data = data;
    }

    // Getters e Setters
    public Long getIdEonet() { return idEonet; }
    public void setIdEonet(Long idEonet) { this.idEonet = idEonet; }
    public String getEonetApiId() { return eonetApiId; }
    public void setEonetApiId(String eonetApiId) { this.eonetApiId = eonetApiId; }
    public String getJsonEvento() { return jsonEvento; }
    public void setJsonEvento(String jsonEvento) { this.jsonEvento = jsonEvento; }
    public Instant getData() { return data; }
    public void setData(Instant data) { this.data = data; }

    Set<Endereco> getEnderecosEnvolvidosInternal() { return enderecosEnvolvidos; }
    protected void setEnderecosEnvolvidos(Set<Endereco> enderecosEnvolvidos) { this.enderecosEnvolvidos = enderecosEnvolvidos; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EonetEventos that = (EonetEventos) o;
        // Chave de negócio primária é o eonetApiId
        if (eonetApiId != null) {
            return eonetApiId.equals(that.eonetApiId);
        }
        // Se ambos eonetApiId são nulos, e os IDs gerados são nulos, são "iguais" apenas se forem a mesma instância.
        // Se os IDs gerados existem, eles devem ser usados para comparação.
        return idEonet != null && idEonet.equals(that.idEonet);
    }

    @Override
    public int hashCode() {
        // Chave de negócio primária é o eonetApiId
        return Objects.hash(eonetApiId);
    }

    @Override
    public String toString() {
        return "EonetEventos{" +
                "idEonet=" + idEonet +
                ", eonetApiId='" + eonetApiId + '\'' +
                ", data=" + data +
                '}';
    }
}
