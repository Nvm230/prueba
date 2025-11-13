package com.univibe.controller;

import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import com.univibe.user.web.UserController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListUsers() {
        User user = new User();
        user.setEmail("admin@univibe.com");
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<User> result = userController.list();

        assertEquals(1, result.size());
        assertEquals("admin@univibe.com", result.get(0).getEmail());
    }

    @Test
    void testUpdateRole() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updated = userController.updateRole(1L, Role.ADMIN);

        assertEquals(Role.ADMIN, updated.getRole());
    }
}
