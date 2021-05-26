import styles from './styles.module.scss';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLocalPreference,
  addToUserPreferences, deleteLocalPreference,
  deleteUserPreference, getLocalPreferences,
  getPreferences,
  getUser,
} from 'store/reducers/users';
import { useState } from 'react';

const isBusyStack = {};

export default function SkillSidebar ({ skill }) {
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const preferences = useSelector(getPreferences);
  const localPreferences = useSelector(getLocalPreferences);

  const [isWaiting, setIsWaiting] = useState(true);

  const handleTogglePreference = (skill) => async () => {
    if (!isBusyStack[skill.id]) {
      isBusyStack[skill.id] = true;
      setIsWaiting(false);

      try {
        if (preferences[skill.id]) {
          await dispatch(deleteUserPreference(skill.id));
        } else {
          await dispatch(addToUserPreferences(skill.id));
        }
      } catch (e) {}

      isBusyStack[skill.id] = false;
      setIsWaiting(true);
    }
  };

  const handleToggleLocalPreference = (skill) => () => {
    if (localPreferences[skill.id]) {
      dispatch(deleteLocalPreference(skill.id));
    } else {
      dispatch(addLocalPreference(skill.id));
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTitle}>{skill.title}</div>
      {
        user && (
          <div className={styles.sidebarButtons}>
            <div
              onClick={handleTogglePreference(skill)}
              className={cn(
                styles.sidebarButton,
                styles.sidebarButtonKnownPref,
                { [styles.sidebarButtonNegative]: preferences[skill.id] },
              )}
            >
              {
                isWaiting
                  ? preferences[skill.id] ? 'I forgot it' : 'I know it'
                  : 'Processing...'
              }
            </div>
            <div
              onClick={handleToggleLocalPreference(skill)}
              className={cn(
                styles.sidebarButton,
                styles.sidebarButtonLocalPref,
                { [styles.sidebarButtonNegative]: localPreferences[skill.id] },
              )}
            >
              {
                isWaiting
                  ? localPreferences[skill.id] ? 'Do not prefer' : 'Prefer it'
                  : 'Processing...'
              }
            </div>
          </div>
        )
      }
    </div>
  );
}
