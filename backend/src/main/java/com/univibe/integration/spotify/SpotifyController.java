package com.univibe.integration.spotify;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {

    @Value("${spotify.client-id:}")
    private String clientId;

    @Value("${spotify.client-secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private String accessToken;
    private long tokenExpiresAt;

    /**
     * Buscar canciones en Spotify
     * Requiere configuración de SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET en application.yml
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchTracks(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int limit) {
        
        if (clientId.isEmpty() || clientSecret.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Spotify API no configurada. Configure SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET."));
        }

        try {
            ensureValidToken();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            String url = String.format(
                    "https://api.spotify.com/v1/search?q=%s&type=track&limit=%d",
                    java.net.URLEncoder.encode(q, java.nio.charset.StandardCharsets.UTF_8),
                    limit
            );
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al buscar en Spotify: " + e.getMessage()));
        }
    }

    @GetMapping("/tracks/{trackId}")
    public ResponseEntity<?> getTrack(@PathVariable String trackId) {
        if (clientId.isEmpty() || clientSecret.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Spotify API no configurada"));
        }

        try {
            ensureValidToken();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            String url = "https://api.spotify.com/v1/tracks/" + trackId;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener track: " + e.getMessage()));
        }
    }

    private void ensureValidToken() {
        if (accessToken == null || System.currentTimeMillis() >= tokenExpiresAt) {
            refreshAccessToken();
        }
    }

    private void refreshAccessToken() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(clientId, clientSecret);
            
            String body = "grant_type=client_credentials";
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://accounts.spotify.com/api/token",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            
            Map<String, Object> tokenResponse = response.getBody();
            if (tokenResponse != null) {
                accessToken = (String) tokenResponse.get("access_token");
                int expiresIn = (Integer) tokenResponse.getOrDefault("expires_in", 3600);
                tokenExpiresAt = System.currentTimeMillis() + (expiresIn - 60) * 1000; // Refresh 1 min before expiry
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener token de Spotify", e);
        }
    }
}

