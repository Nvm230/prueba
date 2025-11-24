package com.univibe.config;

import com.univibe.common.dto.ErrorResponse;
import com.univibe.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApi(ApiException ex, ServletWebRequest req) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(ex.getStatus());
        err.setError(HttpStatus.valueOf(ex.getStatus()).getReasonPhrase());
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.status(ex.getStatus()).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, ServletWebRequest req) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst().orElse("Validation error");
        err.setMessage(msg);
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, ServletWebRequest req) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, ServletWebRequest req) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(HttpStatus.FORBIDDEN.value());
        err.setError(HttpStatus.FORBIDDEN.getReasonPhrase());
        err.setMessage(ex.getMessage() != null ? ex.getMessage() : "Access Denied");
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex, ServletWebRequest req) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        err.setMessage(ex.getMessage());
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, ServletWebRequest req) {
        ex.printStackTrace(); // Log para debugging
        ErrorResponse err = new ErrorResponse();
        err.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        err.setError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        // En desarrollo, mostrar el mensaje real; en producción, mensaje genérico
        String message = ex.getMessage() != null ? ex.getMessage() : "Unexpected error";
        if (message.length() > 200) {
            message = message.substring(0, 200) + "...";
        }
        err.setMessage(message);
        err.setPath(req.getRequest().getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }
}
