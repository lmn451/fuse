import React, { useContext } from "react";
import cx from "classnames";
import LatestMessagesContext from "../../contexts/LatestMessages/LatestMessages";
import UserProfile from "../../common/components/UserProfile/UserProfile";
import USERS from "./constants/users";
import "./_user-list.scss";
import { useActiveChatContext } from "../../contexts/ActiveChat";

function User({ icon, name, lastActive, isOnline, userId, color, onClick }) {
  const { messages } = useContext(LatestMessagesContext);

  return (
    <div className="user-list__users__user" onClick={onClick}>
      <UserProfile icon={icon} name={name} color={color} />
      <div className="user-list__users__user__right-content">
        <div className="user-list__users__user__title">
          <p>{name}</p>
          <p className={cx({ "user-list__users__user__online": isOnline })}>
            {isOnline ? "Online" : lastActive}
          </p>
        </div>
        <p>{messages[userId]}</p>
      </div>
    </div>
  );
}

export default function UserList() {
  const { setActiveChatId } = useActiveChatContext();
  return (
    <div className="user-list">
      <div className="user-list__header">
        <div className="user-list__header__left">
          <p>All Messages</p>
          <i className="fas fa-chevron-down" />
        </div>
        <i className="fas fa-cog" />
      </div>
      <div className="user-list__users">
        {USERS.map((user) => (
          <User
            key={user.name}
            {...user}
            onClick={() => {
              console.log(user);
              setActiveChatId(user.userId);
            }}
          />
        ))}
      </div>
    </div>
  );
}
