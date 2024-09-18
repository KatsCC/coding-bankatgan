import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getRoleFromToken } from '@/auth';

interface ReportFormProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const ReportForm = ({ showAlert }: ReportFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { postLink } = location.state || {};

  const handleUpdateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !content) {
      showAlert('error', '신고 사유와 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/declarations', {
        link: postLink,
        type: type,
        content: content,
      });
      if (response.data) {
        console.log(response.data);
        showAlert('success', '신고가 접수되었습니다');
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (error) {
      showAlert('error', '오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      console.error('신고 중 오류 발생:', error);
    }
  };

  const handleInputClick = () => {
    window.open(postLink, '_blank');
  };

  const role = getRoleFromToken();

  const handleCancelClick = () => {
    // if (role !== 'MANAGER') {
    //   navigate('/report');
    // }
    navigate(-1);
  };

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <TitleStyled>게시글 신고하기</TitleStyled>
        <Label htmlFor="link">링크</Label>
        <FormHeaderStyled>
          <Input type="text" id="link" value={postLink} onClick={handleInputClick} readOnly />
        </FormHeaderStyled>
        <FormContentStyled>
          <Label htmlFor="type">신고 사유</Label>
          <SelectStyled id="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="" disabled hidden>
              신고 유형
            </option>
            <option value="18세 미만">18세 미만인 사용자와 관련된 문제</option>
            <option value="사기">사기 또는 거짓 정보</option>
            <option value="허위">허위 과장 광고</option>
            <option value="정보 오류">상품 정보 오류</option>
            <option value="기타">기타</option>
          </SelectStyled>
          <Label htmlFor="content">신고 내용</Label>
          <TextareaStyled
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="기타 사유를 입력해주세요"
          />
          <Label>
            이미지 수정 요청 시<br />
            관리자 이메일(admin@gmail.com)로 요청해주시기 바랍니다.
          </Label>
        </FormContentStyled>
        <FormBottomStyled>
          <Button onClick={handleCancelClick}>취소</Button>
          <Button onClick={handleUpdateClick}>등록</Button>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: 10px;
`;

const FormHeaderStyled = styled.div`
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
`;

const Label = styled.label`
  margin: 5px 0;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  :not(:last-child)::before {
    content: '* ';
    color: ${({ theme }) => theme.colors.tertiary};
  }

  :last-child {
    font-size: ${({ theme }) => theme.fontSizes.xxsmall};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormContentStyled = styled.div`
  button {
    margin-top: 5px;
    margin-bottom: 20px;
  }

  > button,
  > textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const SelectStyled = styled.select`
  width: 100%;
  height: 40px;
  margin-left: auto;
  margin-top: 8px;
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 5px;
  &:focus,
  &:active {
    border-color: ${({ theme }) => theme.colors.focusShadow};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    outline: none;
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-top: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  resize: none;
`;

const FormBottomStyled = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-around;

  button {
    width: 48%;
    height: 45px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    border-radius: 30px;

    :nth-of-type(1) {
      background-color: ${({ theme }) => theme.colors.gray};
    }

    :nth-of-type(2) {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default ReportForm;
