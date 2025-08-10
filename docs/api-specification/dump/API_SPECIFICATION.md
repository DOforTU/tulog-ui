## Team API

> team/team.controller.ts

### Team Management

-   **Create Team**

    -   `POST /api/teams`
    -   Creates a new team (can specify max members).

-   **Get Team List**

    -   `GET /api/teams`
    -   Retrieves a list of all teams.

-   **Get Team Members**

    -   > team/team-member.controller.ts
    -   `GET /api/teams/:id/members`
    -   Retrieves team members

-   **Get Team by ID**

    -   `GET /api/teams/:id`
    -   Retrieves detailed information for a specific team by ID.

-   **Get Team by Name**
    -   `GET /api/teams/name/:name`
    -   Retrieves detailed information for a specific team by name.

### Team Actions

-   **Invite Member**

    -   > team/team-member.controller.ts
    -   `POST /api/teams/:teamId/invite?uuserIdser=:userId`
    -   Invites a user to the team.

-   **Request to Join Team**

    -   > team/team-member.controller.ts
    -   `POST /api/teams/:id/join`
    -   Requests to join a team.

-   **Change Team Info**

    -   `PATCH /api/teams/:id`
    -   Changes the team's information.(e.g., name, introduction )
    -   also can change the team's visibility (e.g., invite-only).

-   **Kick Member**

    -   > team/team-member.controller.ts
    -   `PATCH /api/teams/:teamId/kick?userId=:userId`
    -   Kicks a member from the team (team leader only).

-   **Leave Team**

    -   > team/team-member.controller.ts
    -   `PATCH /api/teams/:id/leave`
    -   Leaves the team.
    -   If only one member remains, the team is deleted.
    -   If the leader leaves, a new leader must be assigned first.

-   **Transfer Leadership**
    -   > team/team-member.controller.ts
    -   `PATCH /api/teams/:teamId/transfer-leader?userId=:userId`
    -   me --> userId
    -   Transfers team leader privileges to another member.

### Team Follow

-   **Follow Team**

    -   > follow/team-follow.controller.ts
    -   `POST /api/teams/:id/follow`
    -   Follows a team (user follows a team).

-   **Unfollow Team**
    -   > follow/team-follow.controller.ts
    -   `DELETE /api/teams/:id/follow`
    -   Unfollows a team.

---

## Block API

### User Block

> block/user-block.controller.ts

-   **Block a User**

    -   `POST /api/users/:id/block`
    -   Blocks the user with the given ID (prevents interaction, hides content, etc).
    -   Requires JWT authentication.

-   **Unblock a User**

    -   `DELETE /api/users/:id/block`
    -   Unblocks the user with the given ID.
    -   Requires JWT authentication.

-   **Get My Blocked Users**
    -   `GET /api/users/me/blocks`
    -   Returns a list of users blocked by the current user.
    -   Requires JWT authentication.

### Team Block

> block/team-block.controller.ts

-   **Block a Team**

    -   `POST /api/teams/:id/block`
    -   Blocks the team with the given ID (prevents team content from appearing, etc).
    -   Requires JWT authentication.

-   **Unblock a Team**

    -   `DELETE /api/teams/:id/block`
    -   Unblocks the team with the given ID.
    -   Requires JWT authentication.

-   **Get My Blocked Teams**
    -   `GET /api/teams/me/blocks`
    -   Returns a list of teams blocked by the current user.
    -   Requires JWT authentication.

---
