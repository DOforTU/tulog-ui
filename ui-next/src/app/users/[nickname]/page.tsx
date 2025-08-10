"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./user-page.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyFollowing, fetchUserDetails, fetchUserDetailsByNickname } from "@/lib/api/users";

// 컴포넌트 imports
import Profile from "@/components/user-page/profile";
import PostFilter, { PostFilter as PostFilterType } from "@/components/user-page/postFilter";
import MyTags from "@/components/user-page/myTags";
import MyPosts from "@/components/user-page/myPosts";
import FollowModal from "@/components/user-page/followModal";
import { FollowUser, User, UserDetails, UserRole } from "@/lib/types/user.interface";

export default function UserProfilePage() {
    const { currentUser } = useAuth();
    const params = useParams();
    let nickname = "";
    if (typeof params.nickname === "string") {
        nickname = params.nickname;
    } else if (Array.isArray(params.nickname)) {
        nickname = params.nickname[0];
    }
    // URL 디코딩 후 @로 시작하면 제거
    nickname = decodeURIComponent(nickname);
    if (nickname.startsWith("@")) {
        nickname = nickname.slice(1);
    }

    // 유저 정보
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 유저 상세 정보 (팀, 팔로워, 팔로잉 포함)
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [myFollowings, setMyFollowings] = useState<FollowUser[]>([]);
    const [alreadyFollowing, setAlreadyFollowing] = useState<boolean>(false);

    // 모달 상태
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const [activeFilter, setActiveFilter] = useState<PostFilterType>("public");
    const [selectedTag, setSelectedTag] = useState<string>("전체");
    const [followLoading, setFollowLoading] = useState(false);

    // 계정 인증 관련 상태
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCodeSent, setIsCodeSent] = useState(false);

    const isOwnProfile = currentUser && currentUser.nickname === nickname;

    // 유저 정보 및 팔로우 정보 가져오기
    useEffect(() => {
        if (!nickname) return;

        if (currentUser && currentUser.nickname === nickname) {
            // 로그인한 사용자가 본인 프로필을 보는 경우
            // isActive가 false면 인증 화면 표시, true면 세부 정보 가져오기
            if (currentUser.isActive) {
                setFollowLoading(true);
                Promise.all([
                    fetchUserDetails(currentUser.id.toString()),
                    fetchMyFollowing(), // 팔로우 버튼 상태를 위해 내 팔로잉 목록도 필요
                ])
                    .then(([detailsRes, followingRes]: [UserDetails, any]) => {
                        if (detailsRes) {
                            setUserDetails(detailsRes);
                        }
                        if (followingRes?.success) {
                            setMyFollowings(followingRes.data || []);
                        }
                    })
                    .catch((err) => {
                        console.error("사용자 세부 정보 가져오기 실패:", err);
                    })
                    .finally(() => setFollowLoading(false));
            }
            // isActive가 false면 별도 처리 없음 (인증 화면이 렌더링됨)
        } else {
            // 다른 사용자 프로필이거나 비로그인 상태인 경우
            setLoading(true);
            setFollowLoading(true);
            setError("");

            // 닉네임으로 직접 사용자 세부정보 가져오기 (한 번의 요청으로)
            const promises = [fetchUserDetailsByNickname(nickname)];
            if (currentUser) {
                promises.push(fetchMyFollowing());
            }

            Promise.all(promises)
                .then((results) => {
                    const userDetails = results[0] as UserDetails;
                    const followingRes = results[1] as any; // 두 번째 요소는 로그인된 경우에만 존재

                    if (userDetails) {
                        // UserDetails에서 User 정보 추출
                        setUser({
                            id: userDetails.id,
                            nickname: userDetails.nickname,
                            profilePicture: userDetails.profilePicture,
                            isActive: userDetails.isActive,
                            // 다른 필드들은 실제로 필요하지 않으므로 기본값 설정
                            email: "",
                            name: "",
                            role: UserRole.USER,
                            createdAt: "",
                            updatedAt: "",
                            deletedAt: null,
                        });
                        setUserDetails(userDetails);
                    }

                    // 로그인된 사용자인 경우에만 팔로잉 정보 처리
                    if (currentUser && followingRes?.success) {
                        setMyFollowings(followingRes.data || []);
                    }
                })
                .catch((error) => {
                    console.error("User fetch error:", error);
                    setError(`유저를 찾을 수 없습니다. (${error.message || error})`);
                })
                .finally(() => {
                    setLoading(false);
                    setFollowLoading(false);
                });
        }
    }, [nickname, currentUser]);

    // 팔로우 여부 확인 (로그인된 사용자일 때만)
    useEffect(() => {
        if (currentUser && user && myFollowings.length > 0) {
            const isFollowing = myFollowings.some((followUser) => followUser.id === user.id);
            setAlreadyFollowing(isFollowing);
        } else {
            // 비로그인 상태거나 팔로잉 정보가 없으면 false로 설정
            setAlreadyFollowing(false);
        }
    }, [currentUser, user, myFollowings]);

    // 타이머 관련 useEffect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isCodeSent) {
            setIsCodeSent(false);
        }
        return () => clearInterval(timer);
    }, [timeLeft, isCodeSent]);

    // 인증 코드 전송 핸들러
    const handleSendCode = () => {
        if (!email) {
            alert("이메일을 입력해주세요.");
            return;
        }
        // TODO: 실제 API 호출로 인증 코드 전송
        setIsCodeSent(true);
        setTimeLeft(180); // 3분
        console.log("인증 코드 전송:", email);
    };

    // 인증 확인 핸들러
    const handleVerifyCode = () => {
        if (!verificationCode) {
            alert("인증 코드를 입력해주세요.");
            return;
        }
        // TODO: 실제 API 호출로 인증 코드 확인
        console.log("인증 코드 확인:", verificationCode);
    };

    // 시간 포맷 함수
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    if (loading) return <div className={styles.center}>로딩 중...</div>;
    if (error) return <div className={styles.center}>{error}</div>;
    if (!isOwnProfile && !user) return null;

    // 본인 프로필이면서 비활성화된 경우 인증 화면 표시
    if (isOwnProfile && currentUser && !currentUser.isActive) {
        return (
            <div className={styles.container}>
                <div className={styles.verificationSection}>
                    <h2 className={styles.verificationTitle}>계정 인증이 필요합니다</h2>
                    <p className={styles.verificationDescription}>
                        계정이 비활성화되어 있습니다. 이메일 인증을 통해 계정을 활성화해주세요.
                    </p>
                    <div className={styles.verificationForm}>
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.verificationInput}
                        />
                        <input
                            type="text"
                            placeholder="인증 코드를 입력하세요"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className={styles.verificationInput}
                            disabled={!isCodeSent}
                        />
                        <div>
                            <button
                                onClick={handleSendCode}
                                disabled={!email || (isCodeSent && timeLeft > 0)}
                                className={styles.verificationButton}
                            >
                                {isCodeSent ? `재전송 (${formatTime(timeLeft)})` : "인증 코드 전송"}
                            </button>
                            {isCodeSent && (
                                <button
                                    onClick={handleVerifyCode}
                                    disabled={!verificationCode}
                                    className={styles.verificationButton}
                                    style={{ marginTop: "0.5rem" }}
                                >
                                    인증 확인
                                </button>
                            )}
                        </div>
                        {isCodeSent && (
                            <p className={styles.timerText}>
                                인증 코드가 전송되었습니다. {formatTime(timeLeft)} 내에 입력해주세요.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const displayUser = isOwnProfile ? currentUser : user;
    if (!displayUser) return null;

    // 모달 핸들러
    const handleShowFollowers = () => setShowFollowersModal(true);
    const handleShowFollowing = () => setShowFollowingModal(true);

    return (
        <div className={styles.container}>
            {/* 왼쪽 사이드바 */}
            <div className={styles.leftSidebar}>
                {/* 프로필 섹션 */}
                <Profile
                    user={displayUser}
                    isOwnProfile={isOwnProfile}
                    followersCount={userDetails?.followers?.length || 0}
                    followers={userDetails?.followers || []}
                    followingCount={userDetails?.following?.length || 0}
                    following={userDetails?.following || []}
                    followLoading={followLoading}
                    alreadyFollowing={alreadyFollowing}
                    onShowFollowers={handleShowFollowers}
                    onShowFollowing={handleShowFollowing}
                    userTeams={userDetails?.teams || []}
                />

                {/* 태그 섹션 - 위치 변경 */}
                <MyTags selectedTag={selectedTag} onTagChange={setSelectedTag} />
            </div>

            {/* 오른쪽 컨텐츠 */}
            <div className={styles.rightContent}>
                {/* 포스트 필터링 섹션 - 위치 변경 */}
                <PostFilter
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    isOwnProfile={!!isOwnProfile}
                />

                {/* 포스트 섹션 */}
                <MyPosts activeFilter={activeFilter} selectedTag={selectedTag} />
            </div>

            {/* 모달들 */}
            {showFollowersModal && (
                <FollowModal
                    isOpen={showFollowersModal}
                    title="Follower"
                    users={userDetails?.followers || []}
                    onClose={() => setShowFollowersModal(false)}
                />
            )}
            {showFollowingModal && (
                <FollowModal
                    isOpen={showFollowingModal}
                    title="Following"
                    users={userDetails?.following || []}
                    onClose={() => setShowFollowingModal(false)}
                />
            )}
        </div>
    );
}
