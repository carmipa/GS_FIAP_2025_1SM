package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*; // Para todas as anotações JPA
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gs_contato", uniqueConstraints = {
        @UniqueConstraint(name = "unq_gs_contato_email", columnNames = {"email"})
})
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contato")
    private Long idContato;

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

    @ManyToMany(mappedBy = "contatos", fetch = FetchType.LAZY)
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

    // Getters e Setters
    public Long getIdContato() { return idContato; }
    public void setIdContato(Long idContato) { this.idContato = idContato; }
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

    public Set<Cliente> getClientes() {
        return clientes;
    }

    Set<Cliente> getClientesInternal() {
        return clientes;
    }

    protected void setClientes(Set<Cliente> clientes) {
        this.clientes = clientes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Contato contato = (Contato) o;
        return idContato != null && idContato.equals(contato.idContato);
    }

    @Override
    public int hashCode() {
        return idContato != null ? Objects.hash(idContato) : super.hashCode();
    }

    @Override
    public String toString() {
        return "Contato{" +
                "idContato=" + idContato +
                ", email='" + email + '\'' +
                ", tipoContato='" + tipoContato + '\'' +
                '}';
    }
}