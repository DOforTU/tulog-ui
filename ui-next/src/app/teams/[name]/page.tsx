"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchTeamWithMembers, leaveTeam, requestToTeam, kickTeamMember, delegationTeamMember } from "@/lib/api/teams";
import { TeamDetail } from "@/lib/types/team.interface";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./teamDetailPage.module.css";

// 컴포넌트 imports
import TeamPostFilter, { TeamPostFilter as TeamPostFilterType } from "@/components/team-page/postFilter";
import MyTags from "@/components/user-page/myTags";
import TeamPosts from "@/components/team-page/teamPosts";

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentUser } = useAuth();

    let name = "";
    if (typeof params.name === "string") {
        name = params.name;
    } else if (Array.isArray(params.name)) {
        name = params.name[0];
    }
    // URL 디코딩 후 @로 시작하면 제거
    name = decodeURIComponent(name);
    if (name.startsWith("@")) {
        name = name.slice(1);
    }

    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    // URL 쿼리에서 초기값 읽어오기
    const initialFilter = (searchParams.get("category") as TeamPostFilterType) || "public";
    const initialTag = searchParams.get("tag") || "전체";

    // 블로그 관련 상태
    const [activeFilter, setActiveFilter] = useState<TeamPostFilterType>(initialFilter);
    const [selectedTag, setSelectedTag] = useState<string>(initialTag);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // URL 업데이트 함수
    const updateURL = useCallback(
        (filter: TeamPostFilterType, tag: string) => {
            const params = new URLSearchParams();
            if (filter !== "public") {
                params.set("category", filter);
            }
            if (tag !== "전체") {
                params.set("tag", tag);
            }

            const queryString = params.toString();
            const newUrl = queryString
                ? `/teams/@${encodeURIComponent(name)}?${queryString}`
                : `/teams/@${encodeURIComponent(name)}`;

            router.replace(newUrl, { scroll: false });
        },
        [router, name]
    );

    // 카테고리 변경 핸들러
    const handleFilterChange = useCallback(
        (filter: TeamPostFilterType) => {
            setActiveFilter(filter);
            updateURL(filter, selectedTag);
        },
        [selectedTag, updateURL]
    );

    // 태그 변경 핸들러
    const handleTagChange = useCallback(
        (tag: string) => {
            setSelectedTag(tag);
            updateURL(activeFilter, tag);
        },
        [activeFilter, updateURL]
    );

    // 태그 업데이트 핸들러
    const handleTagsUpdate = useCallback(
        (tags: string[]) => {
            setAvailableTags(tags);
            // 현재 선택된 태그가 더 이상 없으면 "전체"로 리셋
            if (selectedTag !== "전체" && !tags.includes(selectedTag)) {
                const newTag = "전체";
                setSelectedTag(newTag);
                updateURL(activeFilter, newTag);
            }
        },
        [selectedTag, activeFilter, updateURL]
    );

    // 드롭다운 메뉴 상태
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 팀원별 메뉴 상태
    const [memberMenus, setMemberMenus] = useState<{ [memberId: number]: boolean }>({});
    const memberMenuRefs = useRef<{ [memberId: number]: HTMLDivElement | null }>({});

    useEffect(() => {
        fetchTeamWithMembers(name)
            .then((res) => setTeam(res.data))
            .catch((err) => {
                console.error("Failed to fetch team:", err);
                setError("존재하지 않는 팀입니다.");
            });
    }, [name]);

    // URL 쿼리 파라미터 변경 감지 및 상태 동기화 (브라우저 뒤로가기/앞으로가기 대응)
    useEffect(() => {
        const category = (searchParams.get("category") as TeamPostFilterType) || "public";
        const tag = searchParams.get("tag") || "전체";

        // URL과 현재 상태가 다를 때만 업데이트 (무한 루프 방지)
        setActiveFilter((prev) => (prev !== category ? category : prev));
        setSelectedTag((prev) => (prev !== tag ? tag : prev));
    }, [searchParams]);

    // 메뉴 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 팀 메뉴 외부 클릭
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }

            // 팀원 메뉴들 외부 클릭
            Object.keys(memberMenus).forEach((memberIdStr) => {
                const memberId = parseInt(memberIdStr);
                const ref = memberMenuRefs.current[memberId];
                if (ref && !ref.contains(event.target as Node)) {
                    setMemberMenus((prev) => ({ ...prev, [memberId]: false }));
                }
            });
        };

        if (isMenuOpen || Object.values(memberMenus).some(Boolean)) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, memberMenus]);

    // 현재 사용자가 팀원인지 확인
    const isCurrentUserMember = () => {
        if (!currentUser || !team) return false;
        return team.teamMembers.some((member) => member?.user?.id === currentUser.id);
    };

    // 현재 사용자가 팀장인지 확인
    const isCurrentUserLeader = () => {
        if (!currentUser || !team) return false;
        return team.teamMembers.some((member) => member?.user?.id === currentUser.id && member?.isLeader);
    };

    // 팀 탈퇴/삭제 처리
    const handleLeaveTeam = async () => {
        if (!team || !currentUser) return;

        setIsMenuOpen(false);
        const isLeader = isCurrentUserLeader();

        // 팀장이 삭제를 시도할 때 다른 멤버가 있는지 확인
        if (isLeader) {
            const otherMembers = team.teamMembers.filter((member) => member?.user?.id !== currentUser.id);

            if (otherMembers.length > 0) {
                alert("팀을 삭제하기 전에 팀장 권한을 다른 팀원에게 위임해야 합니다. 팀 설정에서 팀장을 변경해주세요.");
                return;
            }
        }

        const confirmMessage = isLeader
            ? "정말로 팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            : "정말로 팀에서 탈퇴하시겠습니까?";

        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;

        setIsLeaving(true);
        try {
            await leaveTeam(team.id);
            const successMessage = isLeader ? "팀이 삭제되었습니다." : "팀에서 탈퇴했습니다.";
            alert(successMessage);

            // 새로고침
            window.location.reload();
        } catch (error) {
            console.error("팀 탈퇴/삭제 실패:", error);
            const errorMessage = isLeader ? "팀 삭제 중 오류가 발생했습니다." : "팀 탈퇴 중 오류가 발생했습니다.";
            alert(errorMessage);
        } finally {
            setIsLeaving(false);
        }
    };

    // 팀 참여 요청 처리
    const handleJoinTeam = async () => {
        if (!team || !currentUser) return;

        const confirmed = window.confirm("팀에 참여 요청을 보내시겠습니까?");
        if (!confirmed) return;

        setIsJoining(true);
        try {
            await requestToTeam(team.id);
            alert("팀 참여 요청을 보냈습니다. 팀장의 승인을 기다려주세요.");
        } catch (error) {
            console.error("팀 참여 요청 실패:", error);
            alert("팀 참여 요청 중 오류가 발생했습니다.");
        } finally {
            setIsJoining(false);
        }
    };

    // 사용자 프로필로 이동
    const handleMemberClick = (nickname: string) => {
        router.push(`/users/@${nickname}`);
    };

    // 팀 정보 수정 처리
    const handleEditTeam = () => {
        if (!team) return;
        setIsMenuOpen(false);
        // TODO: 팀 정보 수정 페이지로 이동 또는 모달 열기
        router.push(`/teams/${team.name}/edit`);
    };

    // 메뉴 토글
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // 팀원 메뉴 토글
    const toggleMemberMenu = (memberId: number) => {
        setMemberMenus((prev) => ({
            ...prev,
            [memberId]: !prev[memberId],
        }));
    };

    // 권한 위임 처리
    const handleDelegateAuthority = async (memberId: number, memberNickname: string) => {
        if (!team) return;

        const confirmed = window.confirm(
            `${memberNickname}님에게 팀장 권한을 위임하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
        );
        if (!confirmed) return;

        setMemberMenus((prev) => ({ ...prev, [memberId]: false }));

        try {
            await delegationTeamMember(team.id, memberId);
            alert(`${memberNickname}님에게 팀장 권한을 위임했습니다.`);

            // 페이지 새로고침하여 최신 상태 반영
            window.location.reload();
        } catch (error) {
            console.error("권한 위임 실패:", error);
            alert("권한 위임 중 오류가 발생했습니다.");
        }
    };

    // 팀원 추방 처리
    const handleKickMember = async (memberId: number, memberNickname: string) => {
        if (!team) return;

        const confirmed = window.confirm(`${memberNickname}님을 팀에서 추방하시겠습니까?`);
        if (!confirmed) return;

        setMemberMenus((prev) => ({ ...prev, [memberId]: false }));

        try {
            await kickTeamMember(team.id, memberId);
            alert(`${memberNickname}님을 팀에서 추방했습니다.`);

            // 페이지 새로고침하여 최신 상태 반영
            window.location.reload();
        } catch (error) {
            console.error("팀원 추방 실패:", error);
            alert("팀원 추방 중 오류가 발생했습니다.");
        }
    };

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    if (!team) {
        return <div className={styles.container}>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 왼쪽 사이드바 - 팀 정보 */}
            <div className={styles.leftSidebar}>
                <div className={styles.teamProfileCard}>
                    {/* 팀 액션 메뉴 - 카드 상단 우측 */}
                    {currentUser && isCurrentUserMember() && (
                        <div className={styles.teamMenuContainer} ref={menuRef}>
                            <button className={styles.menuButton} onClick={toggleMenu} aria-label="팀 메뉴">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>

                            {isMenuOpen && (
                                <div className={styles.dropdownMenu}>
                                    {/* 팀장 전용 메뉴 */}
                                    {isCurrentUserLeader() && (
                                        <button className={styles.menuItem} onClick={handleEditTeam}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            팀 설정
                                        </button>
                                    )}

                                    {/* 팀 탈퇴/삭제 메뉴 */}
                                    <button
                                        className={`${styles.menuItem} ${styles.dangerItem}`}
                                        onClick={handleLeaveTeam}
                                        disabled={isLeaving}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16 17L21 12L16 7"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M21 12H9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        {isLeaving
                                            ? isCurrentUserLeader()
                                                ? "삭제 중..."
                                                : "탈퇴 중..."
                                            : isCurrentUserLeader()
                                            ? "팀 삭제"
                                            : "팀 탈퇴"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.teamHeader}>
                        <Image
                            src={team.mainImage}
                            alt="Team image"
                            width={100}
                            height={100}
                            className={styles.teamImage}
                            unoptimized
                        />
                        <div className={styles.teamBasicInfo}>
                            <h1 className={styles.teamName}>{team.name}</h1>
                            <p className={styles.teamVisibility}>
                                {team.visibility === "ONLY_INVITE" ? "초대만 가능" : "초대 및 지원 가능"}
                            </p>
                        </div>
                    </div>

                    <p className={styles.teamIntroduction}>{team.introduction || "팀 소개가 없습니다."}</p>

                    <div className={styles.teamStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{team.maxMember}</span>
                            <span className={styles.statLabel}>최대 인원</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{team.teamMembers.length}</span>
                            <span className={styles.statLabel}>현재 인원</span>
                        </div>
                    </div>

                    {/* 팀 참여 요청 버튼 */}
                    {currentUser &&
                        !isCurrentUserMember() &&
                        team.teamMembers.length < team.maxMember &&
                        team.visibility !== "ONLY_INVITE" && (
                            <button className={styles.joinTeamButton} onClick={handleJoinTeam} disabled={isJoining}>
                                {isJoining ? "요청 중..." : "팀 참여 요청"}
                            </button>
                        )}

                    <div className={styles.memberList}>
                        <h3 className={styles.memberListTitle}>팀원 목록</h3>
                        <div className={styles.memberGrid}>
                            {team.teamMembers
                                .filter((member): member is NonNullable<typeof member> => !!member && !!member.user)
                                .map((member) => (
                                    <div key={member.memberId} className={styles.memberItem}>
                                        <div
                                            className={styles.memberProfile}
                                            onClick={() => handleMemberClick(member.user.nickname)}
                                        >
                                            <Image
                                                src={member.user.profilePicture}
                                                alt={member.user.nickname}
                                                width={32}
                                                height={32}
                                                className={styles.memberImage}
                                                unoptimized
                                            />
                                            <div className={styles.memberInfo}>
                                                <span className={styles.memberNickname}>{member.user.nickname}</span>
                                                {member.isLeader && <span className={styles.leaderBadge}>팀장</span>}
                                            </div>
                                        </div>

                                        {/* 팀장 전용 멤버 액션 메뉴 (본인 제외) */}
                                        {currentUser && isCurrentUserLeader() && member.user.id !== currentUser.id && (
                                            <div
                                                className={styles.memberMenuContainer}
                                                ref={(el) => {
                                                    memberMenuRefs.current[member.memberId] = el;
                                                }}
                                            >
                                                <button
                                                    className={styles.memberMenuButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleMemberMenu(member.memberId);
                                                    }}
                                                    aria-label={`${member.user.nickname} 메뉴`}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="1"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                        <circle
                                                            cx="12"
                                                            cy="5"
                                                            r="1"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                        <circle
                                                            cx="12"
                                                            cy="19"
                                                            r="1"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                </button>

                                                {memberMenus[member.memberId] && (
                                                    <div className={styles.memberDropdownMenu}>
                                                        <button
                                                            className={styles.memberMenuItem}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelegateAuthority(
                                                                    member.memberId,
                                                                    member.user.nickname
                                                                );
                                                            }}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M22 11L20 13L18 11"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M20 13V7"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            권한 위임
                                                        </button>
                                                        <button
                                                            className={`${styles.memberMenuItem} ${styles.memberDangerItem}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleKickMember(member.memberId, member.user.nickname);
                                                            }}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M22 4L20 6L18 4"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            추방
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽 콘텐츠 - 팀 블로그 */}
            <div className={styles.rightContent}>
                {/* 포스트 필터링 섹션 */}
                <TeamPostFilter
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    isTeamMember={isCurrentUserMember()}
                />

                {/* 태그 섹션 */}
                <MyTags selectedTag={selectedTag} onTagChange={handleTagChange} tags={availableTags} />

                {/* 포스트 섹션 */}
                {team && (
                    <TeamPosts
                        teamId={team.id}
                        activeFilter={activeFilter}
                        selectedTag={selectedTag}
                        onTagsUpdate={handleTagsUpdate}
                    />
                )}
            </div>
        </div>
    );
}
