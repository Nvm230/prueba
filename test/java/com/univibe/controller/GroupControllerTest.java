package com.univibe.controller;

import com.univibe.group.model.Group;
import com.univibe.group.repo.GroupRepository;
import com.univibe.group.web.GroupController;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class GroupControllerTest {

    @Mock private GroupRepository groupRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private GroupController groupController;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void testCreateGroup() {
        User owner = new User();
        owner.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(groupRepository.save(any(Group.class))).thenAnswer(inv -> inv.getArgument(0));

        Group g = groupController.create("Team", 1L);

        assertEquals("Team", g.getName());
    }
}
