package br.com.fiap.gs.gsapi.model;

import jakarta.persistence.*; // Importações JPA
import java.util.HashSet;    // Para coleções
import java.util.Set;
import java.util.Objects;

@Entity
@Table(name = "gs_cliente")
public class Cliente {

    @Id
    @SequenceGenerator(name = "gs_cliente_seq", sequenceName = "gs_cliente_id_cliente_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gs_cliente_seq")
    @Column(name = "id_cliente")
    private long idCliente;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "sobrenome", length = 100, nullable = false)
    private String sobrenome;

    @Column(name = "data_nascimento", length = 10, nullable = false)
    private String dataNascimento; // Considerar usar java.time.LocalDate e um @Converter se precisar manipular como data

    @Column(name = "documento", length = 18, nullable = false)
    private String documento;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "gs_clientecontato",
            joinColumns = @JoinColumn(name = "gs_cliente_id_cliente"),
            inverseJoinColumns = @JoinColumn(name = "gs_contato_id_contato")
    )
    private Set<Contato> contatos = new HashSet<>(); // Alterado para uma coleção

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "gs_clienteendereco",
            joinColumns = @JoinColumn(name = "gs_cliente_id_cliente"),
            inverseJoinColumns = @JoinColumn(name = "gs_endereco_id_endereco")
    )
    private Set<Endereco> enderecos = new HashSet<>(); // Alterado para uma coleção

    public Cliente() {
    }

    // Construtor pode ser ajustado para não incluir coleções ou para inicializá-las
    public Cliente(String nome, String sobrenome, String dataNascimento, String documento) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.documento = documento;
    }

    // Getters e Setters para todos os campos (incluindo as coleções)

    public long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(long idCliente) {
        this.idCliente = idCliente;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public Set<Contato> getContatos() {
        return contatos;
    }

    public void setContatos(Set<Contato> contatos) {
        this.contatos = contatos;
    }

    public Set<Endereco> getEnderecos() {
        return enderecos;
    }

    public void setEnderecos(Set<Endereco> enderecos) {
        this.enderecos = enderecos;
    }

    // Equals e hashCode - para entidades JPA, geralmente é melhor baseá-los apenas no ID
    // após a persistência, ou usar uma chave de negócio.
    // A implementação atual pode causar problemas com coleções e lazy loading.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cliente cliente = (Cliente) o;
        return idCliente != 0 && idCliente == cliente.idCliente; // Melhor para JPA
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCliente); // Melhor para JPA
    }
}