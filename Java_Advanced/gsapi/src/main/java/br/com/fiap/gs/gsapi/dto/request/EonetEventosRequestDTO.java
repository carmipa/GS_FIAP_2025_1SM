// Pacote: br.com.fiap.gs.gsapi.dto.request

package br.com.fiap.gs.gsapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public class EonetEventosRequestDTO {

    @NotBlank(message = "O ID original da EONET (eonetApiId) não pode estar em branco.")
    @Size(max = 50, message = "O ID da EONET deve ter no máximo 50 caracteres.")
    private String eonetApiId; // O ID original da API EONET (ex: "EONET_12345")

    @NotBlank(message = "O payload JSON do evento (jsonEvento) não pode estar em branco.")
    // Não há uma anotação de tamanho padrão para CLOB em DTOs,
    // mas a validação de ser um JSON válido ocorreria na camada de serviço ou ao persistir.
    private String jsonEvento; // O JSON completo do evento

    @NotNull(message = "A data do evento/ingestão não pode ser nula.")
    private Instant data; // A coluna 'data' da sua tabela gs_eonet (TIMESTAMP WITH LOCAL TIME ZONE)

    public EonetEventosRequestDTO() {
    }

    public EonetEventosRequestDTO(String eonetApiId, String jsonEvento, Instant data) {
        this.eonetApiId = eonetApiId;
        this.jsonEvento = jsonEvento;
        this.data = data;
    }

    public String getEonetApiId() {
        return eonetApiId;
    }

    public void setEonetApiId(String eonetApiId) {
        this.eonetApiId = eonetApiId;
    }

    public String getJsonEvento() {
        return jsonEvento;
    }

    public void setJsonEvento(String jsonEvento) {
        this.jsonEvento = jsonEvento;
    }

    public Instant getData() {
        return data;
    }

    public void setData(Instant data) {
        this.data = data;
    }
}
