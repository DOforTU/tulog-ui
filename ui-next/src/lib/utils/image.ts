/**
 * 포스트 이미지 URL을 반환합니다. 기본값이 있으면 기본값을 사용합니다.
 */
export const getPostImageUrl = (url: string | undefined): string => {
    if (!url) {
        return process.env.NEXT_PUBLIC_DEFAULT_THUMBNAIL_IMAGE_URL || "";
    }
    return url;
};

/**
 * 사용자 프로필 이미지 URL을 반환합니다. 기본값이 있으면 기본값을 사용합니다.
 */
export const getUserProfileImageUrl = (url: string | undefined): string => {
    if (!url) {
        return process.env.NEXT_PUBLIC_USER_PROFILE_PICTURE || "";
    }
    return url;
};

/**
 * 팀 이미지 URL을 반환합니다. 기본값이 있으면 기본값을 사용합니다.
 */
export const getTeamImageUrl = (url: string | undefined): string => {
    if (!url) {
        return process.env.NEXT_PUBLIC_TEAM_DEFAULT_IMAGE_URL || "";
    }
    return url;
};
