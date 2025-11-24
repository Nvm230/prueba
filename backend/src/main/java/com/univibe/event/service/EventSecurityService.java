package com.univibe.event.service;

import com.univibe.event.model.Event;
import com.univibe.event.model.EventVisibility;
import com.univibe.group.model.Group;
import com.univibe.group.model.GroupEvent;
import com.univibe.group.repo.GroupEventRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EventSecurityService {

    private final GroupEventRepository groupEventRepository;
    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    public EventSecurityService(GroupEventRepository groupEventRepository) {
        this.groupEventRepository = groupEventRepository;
    }

    public String generateCheckInPassword() {
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            password.append(PASSWORD_CHARS.charAt(random.nextInt(PASSWORD_CHARS.length())));
        }
        return password.toString();
    }

    public boolean canAccessEvent(Event event, User user) {
        if (event.getVisibility() == EventVisibility.PUBLIC) {
            return true;
        }

        boolean groupRestricted = isGroupRestricted(event);
        if (!groupRestricted) {
            return user != null;
        }

        if (user == null) {
            return false;
        }
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER) {
            return true;
        }
        if (event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId())) {
            return true;
        }
        return isMemberOfLinkedGroup(event, user);
    }

    public boolean isGroupRestricted(Event event) {
        return groupEventRepository.existsByEventId(event.getId());
    }

    private boolean isMemberOfLinkedGroup(Event event, User user) {
        Long userId = user.getId();
        for (GroupEvent ge : groupEventRepository.findByEventId(event.getId())) {
            Group group = ge.getGroup();
            if (group.getOwner() != null && group.getOwner().getId().equals(userId)) {
                return true;
            }
            boolean memberMatch = group.getMembers().stream().anyMatch(m -> m.getId().equals(userId));
            if (memberMatch) {
                return true;
            }
        }
        return false;
    }
}

