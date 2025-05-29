// No seu arquivo br/com/fiap/gs/gsapi/exception/GlobalExceptionHandler.java

package br.com.fiap.gs.gsapi.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException; // << IMPORTAR
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ... (seus outros handlers existentes: ResourceNotFoundException, MethodArgumentNotValidException, etc.)

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        logger.warn("Recurso não encontrado: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, WebRequest request) {
        logger.warn("Erro de validação nos argumentos: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request - Validation Error");
        body.put("path", request.getDescription(false).replace("uri=", ""));
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.toList());
        body.put("messages", errors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        logger.warn("Argumento ilegal ou requisição inválida: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> handleIllegalStateException(
            IllegalStateException ex, WebRequest request) {
        logger.warn("Estado ilegal para a operação: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Conflict");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<Object> handleServiceUnavailableException(
            ServiceUnavailableException ex, WebRequest request) {
        logger.error("Serviço externo indisponível ou erro de comunicação: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        body.put("error", "Service Unavailable");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String paramName = ex.getName();
        Object paramValue = ex.getValue();
        String requiredType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "Desconhecido";

        String logMessage = String.format(
                "Falha na conversão de tipo do parâmetro da requisição: Nome=''%s'', Valor Recebido=''%s'', Tipo Esperado=''%s''. Erro: %s",
                paramName, paramValue, requiredType, ex.getMessage()
        );
        logger.warn(logMessage);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request - Invalid Parameter Type");
        body.put("message", "O valor '" + paramValue + "' fornecido para o parâmetro '" + paramName + "' não é válido. Tipo esperado: " + requiredType + ".");
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // ***** NOVO HANDLER ADICIONADO PARA MissingServletRequestParameterException *****
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, WebRequest request) {
        logger.warn("Parâmetro obrigatório da requisição ausente: {}", ex.getMessage());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request - Missing Parameter");
        body.put("message", "O parâmetro obrigatório '" + ex.getParameterName() + "' do tipo '" + ex.getParameterType() + "' não foi encontrado na requisição.");
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    // ***** FIM DO NOVO HANDLER *****

    @ExceptionHandler(Exception.class) // Handler genérico para outros erros 500
    public ResponseEntity<Object> handleGenericException(
            Exception ex, WebRequest request) {
        logger.error("Erro inesperado na aplicação: ", ex);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde ou contate o suporte se o problema persistir.");
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}