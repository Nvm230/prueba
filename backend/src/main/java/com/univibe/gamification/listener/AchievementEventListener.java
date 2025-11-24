package com.univibe.gamification.listener;

import com.univibe.gamification.event.*;
import com.univibe.gamification.repo.UserAchievementRepository;
import com.univibe.gamification.service.AchievementService;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.group.repo.GroupRepository;
import com.univibe.social.repo.PostRepository;
import com.univibe.social.repo.StoryRepository;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

/**
 * Listens to application events and triggers achievement checks
 */
@Component
public class AchievementEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(AchievementEventListener.class);
    
    private final AchievementService achievementService;
    private final RegistrationRepository registrationRepository;
    private final PostRepository postRepository;
    private final StoryRepository storyRepository;
    private final FriendshipRepository friendshipRepository;
    private final GroupRepository groupRepository;
    private final UserAchievementRepository userAchievementRepository;
    
    public AchievementEventListener(
            AchievementService achievementService,
            RegistrationRepository registrationRepository,
            PostRepository postRepository,
            StoryRepository storyRepository,
            FriendshipRepository friendshipRepository,
            GroupRepository groupRepository,
            UserAchievementRepository userAchievementRepository) {
        this.achievementService = achievementService;
        this.registrationRepository = registrationRepository;
        this.postRepository = postRepository;
        this.storyRepository = storyRepository;
        this.friendshipRepository = friendshipRepository;
        this.groupRepository = groupRepository;
        this.userAchievementRepository = userAchievementRepository;
    }
    
    @Async
    @EventListener
    public void onEventRegistration(EventRegistrationEvent event) {
        User user = event.getUser();
        logger.debug("Processing event registration for user: {}", user.getEmail());
        
        try {
            // Count total events attended
            long eventsAttended = registrationRepository.countByUser(user);
            
            // PARTICIPATION_FIRST_EVENT
            if (eventsAttended == 1) {
                achievementService.awardAchievementByCode(user, "PARTICIPATION_FIRST_EVENT");
            }
            
            // PARTICIPATION_EVENT_ENTHUSIAST (5 events)
            achievementService.checkAndAwardAchievement(user, "PARTICIPATION_EVENT_ENTHUSIAST", (int) eventsAttended);
            
            // PARTICIPATION_EVENT_VETERAN (10 events)
            achievementService.checkAndAwardAchievement(user, "PARTICIPATION_EVENT_VETERAN", (int) eventsAttended);
            
            // PARTICIPATION_EVENT_MASTER (20 events)
            achievementService.checkAndAwardAchievement(user, "PARTICIPATION_EVENT_MASTER", (int) eventsAttended);
            
            // PARTICIPATION_CENTURY_CLUB (100 events) - LEGENDARY
            achievementService.checkAndAwardAchievement(user, "PARTICIPATION_CENTURY_CLUB", (int) eventsAttended);
            
            // PARTICIPATION_PERFECT_ATTENDANCE (on time check)
            if (event.isOnTime()) {
                achievementService.incrementProgress(user, "PARTICIPATION_PERFECT_ATTENDANCE");
            }
            
            // HIDDEN_SPEED_DEMON (check-in within 1 minute)
            // This would need additional logic in the event to track timing
            
        } catch (Exception e) {
            logger.error("Error processing event registration achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onPostCreated(PostCreatedEvent event) {
        User user = event.getUser();
        logger.debug("Processing post creation for user: {}", user.getEmail());
        
        try {
            // Count total posts
            long postsCreated = postRepository.countByUser(user);
            
            // INTERACTION_FIRST_POST
            if (postsCreated == 1) {
                achievementService.awardAchievementByCode(user, "INTERACTION_FIRST_POST");
            }
            
            // INTERACTION_CONTENT_CREATOR (10 posts)
            achievementService.checkAndAwardAchievement(user, "INTERACTION_CONTENT_CREATOR", (int) postsCreated);
            
            // INTERACTION_PROLIFIC_POSTER (50 posts)
            achievementService.checkAndAwardAchievement(user, "INTERACTION_PROLIFIC_POSTER", (int) postsCreated);
            
            // CREATIVITY_PHOTOGRAPHER (20 images)
            if (event.hasImage()) {
                long imagesPosted = postRepository.countByUserAndMediaUrlIsNotNull(user);
                achievementService.checkAndAwardAchievement(user, "CREATIVITY_PHOTOGRAPHER", (int) imagesPosted);
            }
            
            // CREATIVITY_MUSIC_LOVER (10 songs)
            if (event.hasMusic()) {
                long musicPosts = postRepository.countByUserAndMusicUrlIsNotNull(user);
                achievementService.checkAndAwardAchievement(user, "CREATIVITY_MUSIC_LOVER", (int) musicPosts);
                achievementService.checkAndAwardAchievement(user, "CREATIVITY_DJ", (int) musicPosts);
            }
            
            // CREATIVITY_MULTIMEDIA_MASTER (image + music + text)
            if (event.hasImage() && event.hasMusic()) {
                achievementService.incrementProgress(user, "CREATIVITY_MULTIMEDIA_MASTER");
            }
            
            // HIDDEN_NIGHT_OWL (post at 3 AM)
            LocalTime now = LocalTime.now();
            if (now.getHour() == 3) {
                achievementService.awardAchievementByCode(user, "HIDDEN_NIGHT_OWL");
            }
            
        } catch (Exception e) {
            logger.error("Error processing post creation achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onLikeReceived(LikeReceivedEvent event) {
        User user = event.getPostOwner();
        logger.debug("Processing like received for user: {}", user.getEmail());
        
        try {
            // Count total likes received
            long totalLikes = postRepository.countTotalLikesByUser(user);
            
            // INTERACTION_INFLUENCER (100 likes)
            achievementService.checkAndAwardAchievement(user, "INTERACTION_INFLUENCER", (int) totalLikes);
            
            // INTERACTION_HELPFUL (50 likes)
            achievementService.checkAndAwardAchievement(user, "INTERACTION_HELPFUL", (int) totalLikes);
            
            // INTERACTION_INFLUENCER_ELITE (1000 likes) - LEGENDARY
            achievementService.checkAndAwardAchievement(user, "INTERACTION_INFLUENCER_ELITE", (int) totalLikes);
            
            // INTERACTION_VIRAL_POST (50 likes on single post)
            if (event.getTotalLikes() >= 50) {
                achievementService.awardAchievementByCode(user, "INTERACTION_VIRAL_POST");
                achievementService.awardAchievementByCode(user, "CREATIVITY_TRENDSETTER");
            }
            
        } catch (Exception e) {
            logger.error("Error processing like received achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onFriendAdded(FriendAddedEvent event) {
        User user = event.getUser();
        logger.debug("Processing friend added for user: {}", user.getEmail());
        
        try {
            // Count total friends
            long friendCount = friendshipRepository.countByUser(user);
            
            // PROFILE_SOCIAL_BUTTERFLY (10 friends)
            achievementService.checkAndAwardAchievement(user, "PROFILE_SOCIAL_BUTTERFLY", (int) friendCount);
            
            // PROFILE_POPULAR (50 friends)
            achievementService.checkAndAwardAchievement(user, "PROFILE_POPULAR", (int) friendCount);
            
            // PROFILE_CELEBRITY (100 friends)
            achievementService.checkAndAwardAchievement(user, "PROFILE_CELEBRITY", (int) friendCount);
            
            // PROFILE_COMMUNITY_PILLAR (50 friends + 10 groups)
            long groupsOwned = groupRepository.countByOwner(user);
            if (friendCount >= 50 && groupsOwned >= 10) {
                achievementService.awardAchievementByCode(user, "PROFILE_COMMUNITY_PILLAR");
            }
            
        } catch (Exception e) {
            logger.error("Error processing friend added achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onGroupCreated(GroupCreatedEvent event) {
        User user = event.getUser();
        logger.debug("Processing group created for user: {}", user.getEmail());
        
        try {
            // Count groups owned
            long groupsOwned = groupRepository.countByOwner(user);
            
            // PROFILE_GROUP_CREATOR (first group)
            if (groupsOwned == 1) {
                achievementService.awardAchievementByCode(user, "PROFILE_GROUP_CREATOR");
            }
            
            // PROFILE_COMMUNITY_LEADER (5 groups)
            achievementService.checkAndAwardAchievement(user, "PROFILE_COMMUNITY_LEADER", (int) groupsOwned);
            
            // PROFILE_COMMUNITY_PILLAR (50 friends + 10 groups)
            long friendCount = friendshipRepository.countByUser(user);
            if (friendCount >= 50 && groupsOwned >= 10) {
                achievementService.awardAchievementByCode(user, "PROFILE_COMMUNITY_PILLAR");
            }
            
        } catch (Exception e) {
            logger.error("Error processing group created achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onMessageSent(MessageSentEvent event) {
        User user = event.getUser();
        logger.debug("Processing message sent for user: {}", user.getEmail());
        
        try {
            // This would need a message count repository method
            // For now, we'll increment progress
            achievementService.incrementProgress(user, "INTERACTION_CONVERSATIONALIST");
            achievementService.incrementProgress(user, "INTERACTION_CHATTERBOX");
            
        } catch (Exception e) {
            logger.error("Error processing message sent achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onStoryCreated(StoryCreatedEvent event) {
        User user = event.getUser();
        logger.debug("Processing story created for user: {}", user.getEmail());
        
        try {
            // Count stories
            long storiesCreated = storyRepository.countByUser(user);
            
            // CREATIVITY_FIRST_STORY
            if (storiesCreated == 1) {
                achievementService.awardAchievementByCode(user, "CREATIVITY_FIRST_STORY");
            }
            
            // CREATIVITY_STORYTELLER (5 stories)
            achievementService.checkAndAwardAchievement(user, "CREATIVITY_STORYTELLER", (int) storiesCreated);
            
            // CREATIVITY_STORY_MASTER (25 stories)
            achievementService.checkAndAwardAchievement(user, "CREATIVITY_STORY_MASTER", (int) storiesCreated);
            
        } catch (Exception e) {
            logger.error("Error processing story created achievement", e);
        }
    }
    
    @Async
    @EventListener
    public void onProfileUpdated(ProfileUpdatedEvent event) {
        User user = event.getUser();
        logger.debug("Processing profile updated for user: {}", user.getEmail());
        
        try {
            // PROFILE_PHOTO_UPLOAD
            if (event.hasPhoto()) {
                achievementService.awardAchievementByCode(user, "PROFILE_PHOTO_UPLOAD");
            }
            
            // PROFILE_COMPLETE
            if (event.isComplete()) {
                achievementService.awardAchievementByCode(user, "PROFILE_COMPLETE");
            }
            
        } catch (Exception e) {
            logger.error("Error processing profile updated achievement", e);
        }
    }
}
