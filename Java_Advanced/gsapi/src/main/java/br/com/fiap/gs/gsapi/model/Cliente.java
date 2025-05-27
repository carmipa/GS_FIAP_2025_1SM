package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gs_cliente")
public class Cliente {

    @Id
    // Usando Coluna de Identidade (Oracle 12c+) em vez de Sequence + Trigger explícitos
    // Se o DDL gerado pelo Data Modeler usa Sequence+Trigger, mantenha as anotações @SequenceGenerator e @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ou GenerationType.SEQUENCE se usar o DDL com sequence/trigger
    @Column(name = "id_cliente")
    private Long idCliente; // Usar Long (wrapper) para IDs é uma boa prática, permite nulo antes da persistência

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "sobrenome", length = 100, nullable = false)
    private String sobrenome;

    @Column(name = "data_nascimento", length = 10, nullable = false)
    private String dataNascimento; // Para MVP. Ideal: java.time.LocalDate

    @Column(name = "documento", length = 18, nullable = false, unique = true)
    private String documento;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "gs_clientecontato",
            joinColumns = @JoinColumn(name = "gs_cliente_id_cliente", referencedColumnName = "id_cliente"),
            inverseJoinColumns = @JoinColumn(name = "gs_contato_id_contato", referencedColumnName = "id_contato"))
    private Set<Contato> contatos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "gs_clienteendereco",
            joinColumns = @JoinColumn(name = "gs_cliente_id_cliente", referencedColumnName = "id_cliente"),
            inverseJoinColumns = @JoinColumn(name = "gs_endereco_id_endereco", referencedColumnName = "id_endereco"))
    private Set<Endereco> enderecos = new HashSet<>();

    public Cliente() {
    }

    public Cliente(String nome, String sobrenome, String dataNascimento, String documento) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.documento = documento;
    }

    // Getters e Setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getSobrenome() { return sobrenome; }
    public void setSobrenome(String sobrenome) { this.sobrenome = sobrenome; }
    public String getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public Set<Contato> getContatos() { return contatos; }
    public void setContatos(Set<Contato> contatos) { this.contatos = contatos; }
    public Set<Endereco> getEnderecos() { return enderecos; }
    public void setEnderecos(Set<Endereco> enderecos) { this.enderecos = enderecos; }

    // Métodos utilitários para gerenciar coleções bidirecionais
    public void addContato(Contato contato) {
        this.contatos.add(contato);
        contato.getClientesInternal().add(this); // Use um método package-private ou protected em Contato
    }
    public void removeContato(Contato contato) {
        this.contatos.remove(contato);
        contato.getClientesInternal().remove(this);
    }
    public void addEndereco(Endereco endereco) {
        this.enderecos.add(endereco);
        endereco.getClientesInternal().add(this);
    }
    public void removeEndereco(Endereco endereco) {
        this.enderecos.remove(endereco);
        endereco.getClientesInternal().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cliente cliente = (Cliente) o;
        // Se o ID é nulo, a igualdade só pode ser por referência de objeto.
        // Após a persistência, o ID é a melhor forma de verificar igualdade.
        return idCliente != null && idCliente.equals(cliente.idCliente);
    }

    @Override
    public int hashCode() {
        // Se o ID é nulo, use o hashCode do objeto.
        // Após a persistência, o ID é a melhor forma.
        return idCliente != null ? Objects.hash(idCliente) : super.hashCode();
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "idCliente=" + idCliente +
                ", nome='" + nome + '\'' +
                ", sobrenome='" + sobrenome + '\'' +
                ", documento='" + documento + '\'' +
                '}';
    }
}
