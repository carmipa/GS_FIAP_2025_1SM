// Pacote: br.com.fiap.gs.gsapi.dto.geocoding
package br.com.fiap.gs.gsapi.dto.geocoding;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// Ignora propriedades desconhecidas no JSON para evitar erros de deserialização
@JsonIgnoreProperties(ignoreUnknown = true)
public class NominatimResponseDTO {

    @JsonProperty("place_id")
    private String placeId;

    @JsonProperty("lat")
    private String latitude;

    @JsonProperty("lon")
    private String longitude;

    @JsonProperty("display_name")
    private String displayName;

    // Adicionar mais campos se necessário, como 'address' para detalhes
    // @JsonProperty("address")
    // private NominatimAddressDetailsDTO addressDetails;

    // Construtor padrão
    public NominatimResponseDTO() {
    }

    // Getters e Setters
    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }
    public String getLatitude() { return latitude; }
    public void setLatitude(String latitude) { this.latitude = latitude; }
    public String getLongitude() { return longitude; }
    public void setLongitude(String longitude) { this.longitude = longitude; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    // public NominatimAddressDetailsDTO getAddressDetails() { return addressDetails; }
    // public void setAddressDetails(NominatimAddressDetailsDTO addressDetails) { this.addressDetails = addressDetails; }

    // DTO aninhado para detalhes do endereço, se você precisar deles
    // @JsonIgnoreProperties(ignoreUnknown = true)
    // public static class NominatimAddressDetailsDTO {
    //     private String road;
    //     private String suburb; // Bairro
    //     private String city;
    //     private String state;
    //     private String postcode;
    //     private String country;
    //     // Getters e Setters
    // }
}
