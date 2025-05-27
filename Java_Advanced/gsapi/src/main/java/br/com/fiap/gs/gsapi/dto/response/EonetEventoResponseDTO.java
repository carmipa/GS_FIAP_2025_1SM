// Pacote: br.com.fiap.gs.gsapi.dto.response

package br.com.fiap.gs.gsapi.dto.response;

import java.time.Instant;

public class EonetEventoResponseDTO {
    private long idEonet; // PK numérica interna da sua tabela gs_eonet
    private String eonetApiId; // O ID original da API EONET (ex: "EONET_12345")
    private Instant data; // A coluna 'data' da sua tabela gs_eonet (TIMESTAMP WITH LOCAL TIME ZONE)

    // Campos que seriam extraídos do JSON na camada de serviço/mapper
    private String tituloEvento;
    private String linkEvento;
    private Instant dataOcorrenciaOriginalEonet; // A data do evento conforme reportado pela EONET (pode ser diferente da sua 'data' de ingestão)
    private String categoriaPrincipal; // Exemplo: "Wildfires", "Severe Storms"

    // Não inclua o campo 'jsonEvento' (CLOB) aqui.

    public EonetEventoResponseDTO() {
    }

    // Construtor, Getters e Setters
    public long getIdEonet() { return idEonet; }
    public void setIdEonet(long idEonet) { this.idEonet = idEonet; }
    public String getEonetApiId() { return eonetApiId; }
    public void setEonetApiId(String eonetApiId) { this.eonetApiId = eonetApiId; }
    public Instant getData() { return data; }
    public void setData(Instant data) { this.data = data; }
    public String getTituloEvento() { return tituloEvento; }
    public void setTituloEvento(String tituloEvento) { this.tituloEvento = tituloEvento; }
    public String getLinkEvento() { return linkEvento; }
    public void setLinkEvento(String linkEvento) { this.linkEvento = linkEvento; }
    public Instant getDataOcorrenciaOriginalEonet() { return dataOcorrenciaOriginalEonet; }
    public void setDataOcorrenciaOriginalEonet(Instant dataOcorrenciaOriginalEonet) { this.dataOcorrenciaOriginalEonet = dataOcorrenciaOriginalEonet; }
    public String getCategoriaPrincipal() { return categoriaPrincipal; }
    public void setCategoriaPrincipal(String categoriaPrincipal) { this.categoriaPrincipal = categoriaPrincipal; }
}
