import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import crypto from 'crypto';

import { requestSignIn } from 'store/reducers/users';
import useLocationSearch from 'utils/location-search';

import Form from 'components/app/form';

import styles from './styles.module.scss';
import cn from 'classnames';

const messages = {
  success_signup: {
    success: true,
    message: 'Successfully sign up, now sign in',
  },
};

export function Content () {
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputsData, setInputsData] = useState([]);
  const [popup, setPopup] = useState(null);
  const params = useLocationSearch();

  const onSubmit = async () => {
    const hashedPass = crypto.createHash('sha256').update(password).digest('base64');
    const { result, message } = await dispatch(requestSignIn({
      username,
      password: hashedPass,
    }));

    if (!result) {
      setPopup({
        success: false,
        message,
      });
      return;
    }

    setPopup(null);
    await router.push('/');
  };

  useEffect(() => {
    console.log('111', params);
    setPopup(messages[params.message]);
  }, [params]);

  useEffect(() => {
    const data = [
      {
        label: 'Username',
        type: 'text',
        value: username,
        onChange: (value) => { setUsername(value); },
        rules: [{
          rule: (value) => !!value,
          message: 'Username is required',
        }],
      }, {
        label: 'Password',
        type: 'password',
        value: password,
        onChange: (value) => { setPassword(value); },
        rules: [{
          rule: (value) => !!value,
          message: 'Password is required',
        }],
      },
    ];

    setInputsData(data);
  }, [username, password]);

  return (
    <div className={cn('content', styles.wrapper)}>
      <Form
        title={'Sign into your account'}
        button={'Sign in'}
        inputsData={inputsData}
        onSubmit={onSubmit}
        popup={popup}
      />
    </div>
  );
}
