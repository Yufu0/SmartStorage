package fr.pfe.vizisalive.backend.services;

import fr.pfe.vizisalive.backend.models.CustomUserDetailsModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    MongoService mongoService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        CustomUserDetailsModel user = mongoService.findUser(username);

        if (user == null)
            throw new UsernameNotFoundException("User Not Found with username: " + username);

        return user;
    }
}
