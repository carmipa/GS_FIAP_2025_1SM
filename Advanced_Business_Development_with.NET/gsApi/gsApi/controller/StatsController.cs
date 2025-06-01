// File: gsApi/controller/StatsController.cs
using gsApi.data;
using gsApi.dto.response; // Para CategoryCountDto e NasaEonetEventDto (usado para parsear o JSON)
using gsApi.DTOs.Response;
using gsApi.model;
using gsApi.model.DTOs.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace gsApi.controller
{
    /// <summary>
    /// Fornece endpoints para obter dados estatísticos sobre eventos EONET.
    /// </summary>
    [ApiController]
    [Route("api/stats")]
    [Produces("application/json")]
    [Consumes("application/json")]
    public class StatsController : ControllerBase
    {
        private readonly ILogger<StatsController> _logger;
        private readonly AppDbContext _context;

        public StatsController(ILogger<StatsController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Obtém a contagem de eventos EONET locais por categoria para um determinado período em dias.
        /// </summary>
        /// <remarks>
        /// Calcula o número de eventos para cada categoria com base nos dados JSON armazenados 
        /// para os eventos EONET dentro do período especificado.
        /// </remarks>
        /// <param name="days">Número de dias no passado a serem considerados para a estatística (ex: 365 para o último ano). Deve ser um número positivo. Padrão é 365.</param>
        /// <response code="200">Retorna as estatísticas de contagem de eventos por categoria.</response>
        /// <response code="400">Se o parâmetro 'days' for inválido (ex: não positivo).</response>
        /// <response code="500">Se ocorrer um erro interno inesperado no servidor durante o processamento.</response>
        [HttpGet("eonet/count-by-category")]
        [ProducesResponseType(typeof(List<CategoryCountDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEonetCountByCategory(
            [FromQuery, Range(1, int.MaxValue, ErrorMessage = "O parâmetro 'days' deve ser um número positivo maior que zero.")] int days = 365)
        {
            _logger.LogInformation("Endpoint GET /api/stats/eonet/count-by-category chamado com days: {Days}", days);

            // A validação do range de 'days' já é feita pelo atributo [Range] e seria tratada pelo ModelState.
            // Se quisermos uma validação explícita adicional ou se o ModelState não for usado para este caso:
            if (days <= 0)
            {
                // Isso normalmente seria pego pelo filtro de validação do ASP.NET Core se o ModelState fosse checado,
                // mas para garantir um retorno claro se essa checagem não for feita antes.
                return BadRequest(new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Parâmetro Inválido",
                    Detail = "O parâmetro 'days' deve ser um número positivo maior que zero."
                });
            }

            var dataFinal = DateTimeOffset.UtcNow;
            var dataInicial = dataFinal.AddDays(-days);

            _logger.LogInformation("Calculando estatísticas de eventos EONET por categoria de {DataInicial} até {DataFinal}", dataInicial, dataFinal);

            var eventosNoPeriodo = await _context.EonetEvents
                                             .Where(e => e.Data.HasValue && e.Data.Value >= dataInicial && e.Data.Value <= dataFinal && e.Json != null)
                                             .AsNoTracking()
                                             .ToListAsync();

            _logger.LogInformation("{Count} eventos locais encontrados com JSON e data válida entre {DataInicial} e {DataFinal} para contagem por categoria.",
                eventosNoPeriodo.Count, dataInicial, dataFinal);

            var categoryCounts = new Dictionary<string, long>();
            var jsonSerializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            foreach (var eventoLocal in eventosNoPeriodo)
            {
                if (string.IsNullOrEmpty(eventoLocal.Json))
                {
                    continue;
                }

                try
                {
                    // Desserializar o JSON armazenado para o DTO NasaEonetEventDto
                    NasaEonetEventDto? eventoNasaDto = JsonSerializer.Deserialize<NasaEonetEventDto>(eventoLocal.Json, jsonSerializerOptions);

                    if (eventoNasaDto?.Categories != null)
                    {
                        foreach (var category in eventoNasaDto.Categories)
                        {
                            if (!string.IsNullOrEmpty(category.Title))
                            {
                                if (categoryCounts.ContainsKey(category.Title))
                                {
                                    categoryCounts[category.Title]++;
                                }
                                else
                                {
                                    categoryCounts[category.Title] = 1;
                                }
                            }
                        }
                    }
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogWarning(jsonEx, "Falha ao desserializar JSON para o evento EONET com ID Interno {IdInterno} e API ID {ApiId}. JSON Snippet: {JsonSnippet}",
                        eventoLocal.IdEonet,
                        eventoLocal.EonetIdApi,
                        eventoLocal.Json.Length > 200 ? eventoLocal.Json.Substring(0, 200) + "..." : eventoLocal.Json);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro inesperado ao processar categorias para o evento EONET com ID Interno {IdInterno} e API ID {ApiId}.", eventoLocal.IdEonet, eventoLocal.EonetIdApi);
                }
            }

            var statsResult = categoryCounts
                                .Select(kvp => new CategoryCountDto(kvp.Key, kvp.Value))
                                .OrderByDescending(dto => dto.Count)
                                .ToList();

            _logger.LogInformation("Estatísticas de contagem por categoria geradas com {Count} categorias distintas.", statsResult.Count);
            return Ok(statsResult);
        }
    }
}