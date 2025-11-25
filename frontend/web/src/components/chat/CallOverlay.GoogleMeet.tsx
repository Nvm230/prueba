// Google Meet Style Layout Component
// This will replace the current CallOverlay layout
import React from 'react';

interface GoogleMeetLayoutProps {
    mainVideo: React.ReactNode;
    sidebarVideos: React.ReactNode[];
    isScreenSharing: boolean;
}

export const GoogleMeetLayout: React.FC<GoogleMeetLayoutProps> = ({
    mainVideo,
    sidebarVideos,
    isScreenSharing
}) => {
    return (
        <div className="flex h-full gap-2 p-2">
            {/* Main video area */}
            <div className="flex-1 relative">
                {mainVideo}
            </div>

            {/* Sidebar with thumbnails */}
            {sidebarVideos.length > 0 && (
                <div className="w-64 flex flex-col gap-2 overflow-y-auto">
                    {sidebarVideos.map((video, index) => (
                        <div key={index} className="aspect-video">
                            {video}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
