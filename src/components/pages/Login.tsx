import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/auth';
import { Input } from '@/components/ui/input';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import GoogleIcon from '@/assets/icons/GoogleIcon';

const Login = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showSignupComplete, setShowSignupComplete] = useState(false);
  const navigate = useNavigate();

  /** signup -> login 진입시 */
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('signup') === 'true') {
      setIsVisible(false);
      setShowSignupComplete(true);

      setTimeout(() => {
        setShowSignupComplete(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login(email, password);
    } catch (error) {
      console.error('에러 테스트');
      setShowLoginError(true);
      setTimeout(() => {
        setShowLoginError(false);
      }, 5000);
    }
  };

  /** google 로그인 인증 */
  const sendAuthCode = async (authCode: string) => {
    try {
      const response = await axios.post('/api/auth/google', {
        code: authCode,
      });
      console.log(response);

      const { access_token, refresh_token } = response.data.mockTokens;

      Cookies.set('access_token', access_token, { expires: 7 });
      Cookies.set('refresh_token', refresh_token, { expires: 7 });

      return { access_token, refresh_token };
    } catch (error) {
      console.error('Failed to send Auth Code:', error);
      throw error;
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async response => {
      const authCode = response.code;

      try {
        // Auth Code를 보내고 토큰을 받음
        const tokens = await sendAuthCode(authCode);
        console.log('Tokens stored:', tokens);
        navigate('/');
      } catch (error) {
        console.error('Login Failed:', error);
      }
    },
    onError: error => {
      console.error('Login Failed:', error);
    },
    flow: 'auth-code',
  });

  return (
    <AuthLayout>
      {showSignupComplete && <Complete>회원가입이 완료되었습니다.</Complete>}
      {showLoginError && <Error>이메일 또는 패스워드를 확인해주세요.</Error>}
      <Container isVisible={isVisible}>
        <FirstLogo isVisible={isVisible}>
          <LogoImage src="/오늘한잔.png" alt="오늘한잔" />
          <Spinner />
        </FirstLogo>
      </Container>
      <FormContainer onSubmit={handleSubmit}>
        <LogoImage src="/오늘한잔.png" alt="오늘한잔" />
        <Heading>모두를 위한 특산주</Heading>
        <Label htmlFor="email">아이디(이메일)</Label>
        <Input type="email" name="email" id="email" />
        <Label htmlFor="password">패스워드</Label>
        <Input type="password" name="password" id="password" />
        <LoginBtn type="submit">로그인</LoginBtn>
        <Link to={'/signup'}>
          <SignupBtn>회원가입</SignupBtn>
        </Link>
        <GoogleBtn onClick={googleLogin}>
          <GoogleIcon /> Google로 로그인
        </GoogleBtn>
      </FormContainer>
    </AuthLayout>
  );
};

export default Login;

const AuthLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};

  @media (orientation: landscape) {
    height: auto;
    min-height: 100vh;
  }
`;

const FirstLogo = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${props => props.theme.colors.white};

  transition: transform 1s ease-in-out;
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(-100%)')};
`;

const LogoImage = styled.img`
  width: 140px;
  height: 140px;
  margin: 0 auto 0 auto;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% { 
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 12px solid ${props => props.theme.colors.gray};
  border-top-color: ${props => props.theme.colors.tertiary};
  margin-top: 20px;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'hidden')};
  width: 100vw;
  height: 100vh;

  position: absolute;

  transition: transform 1s ease-in-out;
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(-100%)')};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 330px;
  width: 100%;
  height: 100%;
  margin: 30px;
  background-color: ${({ theme }) => theme.colors.white};

  input {
    margin-bottom: 16px;
    background-color: ${({ theme }) => theme.colors.lightGray};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  a {
    width: 100%;
  }
`;

const Heading = styled.p`
  width: 60%;
  margin: 5px auto 25px auto;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  &::before {
    margin-right: 4px;
    content: '*';
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  margin: 12px 0 12px 0;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  text-align: center;
`;

const SignupBtn = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 50px;
  font-weight: bold;
  text-align: center;
`;

const GoogleBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 50px;
  font-weight: bold;
  text-align: center;
  margin-top: 12px;
  svg {
    width: 30px;
    height: 100%;
  }
`;

const Complete = styled.button`
  position: absolute;
  width: 310px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.success};
  border: 1px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  top: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;

const Error = styled.button`
  position: absolute;
  width: 310px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.error};
  border: 1px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  top: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;
