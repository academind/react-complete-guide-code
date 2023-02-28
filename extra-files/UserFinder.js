import { Fragment, useState, useEffect } from 'react';

import Users from './Users';
import styles from "./UserFinder.module.css";

const UserFinder = () => {
  const [filteredUsers, setFilteredUsers] = useState(DUMMY_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredUsers(
      DUMMY_USERS.filter((user) => user.name.includes(searchTerm))
    );
  }, [searchTerm]);

  const searchChangeHandler = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Fragment>
    <div className={styles.finder}>
      <input type='search' onChange={searchChangeHandler} />
        </div>
      <Users users={filteredUsers} />
    </Fragment>
  );
};

export default UserFinder;
