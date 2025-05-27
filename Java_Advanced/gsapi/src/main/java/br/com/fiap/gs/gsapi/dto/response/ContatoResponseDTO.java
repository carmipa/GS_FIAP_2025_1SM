package br.com.fiap.gs.gsapi.dto.response;

public class ContatoResponseDTO {
    private long idContato;
    private String ddd;
    private String telefone;
    private String celular;
    private String whatsapp;
    private String email;
    private String tipoContato;

    public ContatoResponseDTO() {
    }
    // Construtor, Getters e Setters
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
}