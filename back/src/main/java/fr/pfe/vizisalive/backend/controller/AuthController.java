package fr.pfe.vizisalive.backend.controller;

import fr.pfe.vizisalive.backend.models.AuthModel;
import fr.pfe.vizisalive.backend.models.CustomUserDetailsModel;
import fr.pfe.vizisalive.backend.services.JWTService;
import fr.pfe.vizisalive.backend.services.MongoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    MongoService mongoService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JWTService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Void> authenticateUser(@Valid @RequestBody AuthModel authModel) {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(authModel.username(), authModel.password());

        Authentication authentication = authenticationManager
                .authenticate(usernamePasswordAuthenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetailsModel userDetails = (CustomUserDetailsModel) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtService.generateJwtCookie(userDetails);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser() {
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtService.clearJwtCookie().toString()).build();
    }
}
