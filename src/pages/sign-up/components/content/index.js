import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import crypto from 'crypto';

import { requestSignUp } from 'store/reducers/users';

import Form from 'components/app/form';
import { validateEmail } from 'utils/validators';

import styles from './styles.module.scss';

export function Content () {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputsData, setInputsData] = useState([]);
  const [popup, setPopup] = useState(null);

  const onSubmit = async () => {
    const hashedPass = crypto.createHash('sha256').update(password).digest('base64');
    const { result, message } = await requestSignUp({
      username,
      email,
      password: hashedPass,
    });

    if (!result) {
      setPopup({
        success: false,
        message,
      });
      return;
    }

    setPopup(null);
    await router.push('/sign-in?message=success_signup');
  };

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
        label: 'Email',
        type: 'text',
        value: email,
        onChange: (value) => { setEmail(value); },
        rules: [{
          rule: (value) => !!value,
          message: 'Email is required',
        }, {
          rule: (value) => validateEmail(value),
          message: 'Email is invalid',
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
  }, [username, email, password]);

  return (
    <div className={cn('content', styles.wrapper)}>
      <Form
        title={'Create Account'}
        button={'Create account'}
        inputsData={inputsData}
        onSubmit={onSubmit}
        popup={popup}
      />
    </div>
  );
}
