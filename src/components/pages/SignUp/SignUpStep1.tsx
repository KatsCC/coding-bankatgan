import styled from '@emotion/styled';
import { Button, Label } from './SignUp';
import { Input } from '@/components/ui/input';
import { keyframes } from '@emotion/react';

const SignUpStep1 = ({
  name,
  setName,
  date,
  setDate,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  nextSlide,
  confirmAlert,
  dateConfirm,
  emailConfirm,
  validatedEmail,
  validatedText,
  validatedPassword,
  validatedLoading,
}: {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  nextSlide: () => void;
  confirmAlert: boolean;
  dateConfirm: boolean;
  emailConfirm: boolean;
  validatedEmail: boolean;
  validatedText: string;
  validatedPassword: boolean;
  validatedLoading: boolean;
}) => {
  const isMatch = password === confirmPassword && password !== '';

  return (
    <Wrapper>
      <ScrollCont>
        <Container>
          <Header>기본적인 정보를 입력해주세요.</Header>
          <Label htmlFor="name">
            닉네임(이름)
            {
              <Validation>
                {name.length < 2 || name.length > 7 ? '※2~7자로 해주세요.' : ''}
              </Validation>
            }
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <AlertText>{name === '' && confirmAlert && '닉네임(이름)을 입력해주세요.'}</AlertText>
          <Label htmlFor="email">
            생년월일
            {<Validation>{dateConfirm && '※올바른 날짜를 입력해주세요'}</Validation>}
          </Label>

          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            value={date}
            onChange={e => {
              setDate(e.target.value);
            }}
          />
          <AlertText>{date === '' && confirmAlert && '생년월일을 선택해주세요.'}</AlertText>
          <Label htmlFor="email">
            아이디(이메일)
            {!validatedLoading && !validatedEmail && (
              <Validation>이미 등록된 이메일 입니다.</Validation>
            )}
            {validatedText !== '' && (
              <>
                <CheckEmail>※중복 확인 중</CheckEmail>
                <Loading />
              </>
            )}
            {!validatedLoading && validatedEmail && (
              <ConFirmed>사용가능한 이메일 입니다.</ConFirmed>
            )}
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <AlertText>
            {email === '' && confirmAlert && '올바른 아이디(이메일)를 입력해주세요.'}
            {!emailConfirm && '올바른 아이디(이메일)를 입력해주세요.'}
          </AlertText>
          <Label htmlFor="password">패스워드</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <AlertText>
            {
              <Validation>
                {!validatedPassword && '※8~15자로 대소문자,숫자,특수문자를 포함하여야 합니다.'}
              </Validation>
            }
          </AlertText>
          <Label htmlFor="confirmPassword">패스워드 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <AlertText>
            {password && confirmPassword && !isMatch && '패스워드가 일치하지 않습니다.'}
          </AlertText>
          <AlarmText>
            *회원가입시 작성한 이메일로 주기마다
            <br />
            &nbsp; 특산주 추천 메일을 보내드립니다.
          </AlarmText>
        </Container>
      </ScrollCont>
      <Button onClick={() => nextSlide()}>다음</Button>
    </Wrapper>
  );
};

export default SignUpStep1;

const AlertText = styled.p`
  height: 5px;
  margin-bottom: 12px;

  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const Validation = styled.span`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.error};
`;

const CheckEmail = styled.span`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.darkGray};
`;
const ConFirmed = styled.span`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.success};
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% { 
    transform: rotate(360deg);
  }
`;

const Loading = styled.div`
  margin-left: 3px;
  width: 15px;
  height: 15px;
  border: 3px solid ${props => props.theme.colors.gray};
  border-top-color: ${props => props.theme.colors.tertiary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px 20px 20px;
  min-width: 100vw;
  height: calc(95vh;

  background-color: white;
`;
export const ScrollCont = styled.div`
  height: calc(100vh - 120px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const Container = styled.div`
  overflow-y: scroll;
  margin: 5px;
  padding: 5px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  input {
    margin-bottom: 2px;
    background-color: ${({ theme }) => theme.colors.brightGray};
    font-size: ${({ theme }) => theme.fontSizes.small};

    &:focus {
      border: 1px solid ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

export const Header = styled.h2`
  margin: 20px 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;

  p {
    font-weight: normal;
  }
`;

export const AlarmText = styled.p`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

export const Step = styled.div`
  display: flex;
  width: 50%;
  height: 5px;
  margin: 0 auto 10px auto;
`;

export const Orange1 = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 33.33%;
  height: 100%;
`;

export const Orange2 = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 66.67%;
  height: 100%;
`;

export const Orange3 = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: 100%;
`;

export const Gray1 = styled.div`
  background-color: ${({ theme }) => theme.colors.gray};
  width: 66.67%;
  height: 100%;
`;

export const Gray2 = styled.div`
  background-color: ${({ theme }) => theme.colors.gray};
  width: 33.33%;
  height: 100%;
`;
