package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "gs_contato")
public class Contato {

    @Id
    @SequenceGenerator(name = "gs_contato_seq", sequenceName = "gs_contato_id_contato_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gs_contato_seq")
    @Column(name = "id_contato")
    private long idContato;

    @Column(name = "ddd", length = 3, nullable = false)
    private String ddd;

    @Column(name = "telefone", length = 15, nullable = false)
    private String telefone;

    @Column(name = "celular", length = 15, nullable = false)
    private String celular;

    @Column(name = "whatsapp", length = 15, nullable = false)
    private String whatsapp;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "tipo_contato", length = 50, nullable = false)
    private String tipoContato;

    @ManyToMany(mappedBy = "contatos", fetch = FetchType.LAZY) // Mapeado pelo campo "contatos" em Cliente
    private Set<Cliente> clientes = new HashSet<>();

    public Contato() {
    }

    public Contato(String ddd, String telefone, String celular, String whatsapp, String email, String tipoContato) {
        this.ddd = ddd;
        this.telefone = telefone;
        this.celular = celular;
        this.whatsapp = whatsapp;
        this.email = email;
        this.tipoContato = tipoContato;
    }

    // Getters e Setters para todos os campos

    public long getIdContato() { return idContato; }
    public void setIdContato(long idContato) { this.idContato = idContato; }
    public String getDdd() { return ddd; }
    public void setDdd(String ddd) { this.ddd = ddd; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTipoContato() { return tipoContato; }
    public void setTipoContato(String tipoContato) { this.tipoContato = tipoContato; }
    public Set<Cliente> getClientes() { return clientes; }
    public void setClientes(Set<Cliente> clientes) { this.clientes = clientes; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Contato contato = (Contato) o;
        return idContato != 0 && idContato == contato.idContato;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idContato);
    }
}