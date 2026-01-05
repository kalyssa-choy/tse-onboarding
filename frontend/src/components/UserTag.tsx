import React from "react";

import styles from "./UserTag.module.css";

import type { User } from "src/api/users";

export type UserTagProps = {
  user?: User | null;
  className?: string;
};

export const UserTag: React.FC<UserTagProps> = ({ user, className }) => {
  // CASE 1: No user assigned
  if (!user) {
    return (
      <div className={`${styles.userTag} ${className ?? ""}`}>
        <div className={styles.notAssigned}>Not assigned</div>
      </div>
    );
  }

  // CASE 2: User exists
  const profilePic = user.profilePictureURL ?? "/userDefault.svg";

  return (
    <div className={`${styles.userTag} ${className ?? ""}`}>
      <div className={styles.topRow}>
        <img src={profilePic} alt={user.name} className={styles.profilePic} />
        <span className={styles.userName}>{user.name}</span>
      </div>
    </div>
  );
};
