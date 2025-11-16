package com.univibe.group.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.group.model.Group;
import com.univibe.group.repo.GroupRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupController(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public PageResponse<Group> list(
            @RequestParam Optional<String> search,
            @PageableDefault(size = 8, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return search.filter(StringUtils::hasText)
                .map(String::trim)
                .map(query -> PageResponse.from(groupRepository.findByNameContainingIgnoreCase(query, pageable)))
                .orElseGet(() -> PageResponse.from(groupRepository.findAll(pageable)));
    }

    @GetMapping("/{groupId}")
    public Group get(@PathVariable Long groupId) {
        return groupRepository.findById(groupId).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Group create(Authentication auth, @RequestParam @NotBlank String name) {
        String email = (String) auth.getPrincipal();
        User owner = userRepository.findByEmail(email).orElseThrow();
        Group g = new Group();
        g.setName(name);
        g.setOwner(owner);
        g.getMembers().add(owner);
        return groupRepository.save(g);
    }

    @PostMapping("/{groupId}/join")
    public Map<String, Object> join(@PathVariable Long groupId, @RequestParam Long userId) {
        Group g = groupRepository.findById(groupId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        g.getMembers().add(u);
        groupRepository.save(g);
        return Map.of("members", g.getMembers().size());
    }
}
