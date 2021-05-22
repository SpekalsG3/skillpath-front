import React, { useEffect, useState } from 'react';
import { fetchPreferences, getUser } from 'store/reducers/users';
import { useDispatch, useSelector } from 'react-redux';

import useHeader from 'utils/use-header';

import Header from 'components/ui/header';
import Footer from 'components/ui/footer';

import Map from './components/map';
import SkillSidebar from './components/skill-sidebar';

export default function IndexPage () {
  const dispatch = useDispatch();
  const head = useHeader(
    'Pick the best skill',
    'Pick skill which suits your interests and also in demand',
  );

  const user = useSelector(getUser);

  useEffect(async () => {
    if (user) {
      await dispatch(fetchPreferences);
    }
  }, [user]);

  const [selectedSkill, setSelectedSkill] = useState(null);

  const onSkillSelect = (skill) => {
    if (selectedSkill?.id === skill.id) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };

  return (
    <div>
      {head}
      <Header/>
      <div style={{
        'min-height': 'calc(100vh - 175px)',
      }}>
        <Map onSkillSelect={onSkillSelect} />
        {selectedSkill && user && <SkillSidebar skill={selectedSkill} />}
      </div>
      <Footer/>
    </div>
  );
}
