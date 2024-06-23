package fr.pfe.vizisalive.backend.services;

import fr.pfe.vizisalive.backend.Environment;
import fr.pfe.vizisalive.backend.enums.ELogLevel;
import fr.pfe.vizisalive.backend.models.CustomUserDetailsModel;
import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.util.Date;

@Component
public class JWTService {

    @Autowired
    private MongoService mongoService;

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, Environment.JWT_COOKIE_NAME);
        if (cookie != null)
            return cookie.getValue();
        else
            return null;
    }

    public ResponseCookie generateJwtCookie(CustomUserDetailsModel user) {
        String jwt = generateTokenFromUsername(user.getUsername());
        return ResponseCookie.from(Environment.JWT_COOKIE_NAME, jwt).path("/api").maxAge(Environment.JWT_EXPIRATION_MS).httpOnly(true).build();
    }

    public ResponseCookie clearJwtCookie() {
        return ResponseCookie.from(Environment.JWT_COOKIE_NAME, null).path("/api").build();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(Environment.JWT_SECRET).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(Environment.JWT_SECRET).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            mongoService.log(ELogLevel.ERROR, "Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            mongoService.log(ELogLevel.ERROR, "Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            mongoService.log(ELogLevel.ERROR, "JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            mongoService.log(ELogLevel.ERROR, "JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            mongoService.log(ELogLevel.ERROR, "JWT claims string is empty: " + e.getMessage());
        }

        return false;
    }

    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + Environment.JWT_EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS512, Environment.JWT_SECRET)
                .compact();
    }
}
