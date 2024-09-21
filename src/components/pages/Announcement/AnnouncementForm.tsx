import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { Button } from '@/components/ui/button';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { fetchAnnouncementWriteApi } from '@/api/postApi';
import PlusIcon from '@/assets/icons/PlusIcon';

const writeAnnouncement = async (title: string, content: string, imageUrl: string) => {
  try {
    const response = await fetchAnnouncementWriteApi(title, content, imageUrl);
    return response;
  } catch (err) {
    console.error('Error writing announcement: ', err);
  }
};

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImg, setNewImg] = useState('');
  const handleAnnouncementSubmit = async () => {
    if (newTitle.trim() === '' || newContent.trim() === '') return;

    try {
      const response = await writeAnnouncement(newTitle, newContent, newImg);

      if (response) {
        const newAnnouncementData = {
          ...response,
          id: Date.now(),
        };

        setNewTitle('');
        setNewContent('');
        setNewImg('');

        navigate(`/announcement/${newAnnouncementData.id}`, { state: newAnnouncementData });
        // navigate('/announcement', { state: { newAnnouncement: newAnnouncementData } });
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  //** 이미지 업로드 */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelClick = () => {
    navigate('/announcement');
  };

  return (
    <NoFooterLayout>
      <ContentWrapper>
        <TitleStyled>공지 등록</TitleStyled>
        <FormContentWrapper>
          <Label>제목</Label>
          <Input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
          />
          <Label>내용</Label>
          <TextareaStyled
            placeholder="공지 내용 등록"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            required
          />
        </FormContentWrapper>
        <Label>이미지</Label>
        <FormImgWrapper>
          <input type="file" accept="image/*" ref={fileInputRef} />
          {/* <img src="https://thesool.com/common/imageView.do?targetId=PR00000697&targetNm=PRODUCT" /> */}
          <Button onClick={handleBtnClick}>
            <PlusIcon />
          </Button>
        </FormImgWrapper>
        <FormBottomStyled>
          <Button onClick={handleCancelClick}>취소</Button>
          <Button onClick={handleAnnouncementSubmit}>등록</Button>
        </FormBottomStyled>
      </ContentWrapper>
    </NoFooterLayout>
  );
};

const TitleStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  margin-bottom: 10px;
`;

const FormContentWrapper = styled.div`
  input {
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.colors.brightGray};
  }

  > input,
  textarea {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
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

const TextareaStyled = styled(Textarea)`
  height: 150px;
  background-color: ${({ theme }) => theme.colors.brightGray};
  resize: none;
`;

const FormImgWrapper = styled.div`
  min-width: 316px;
  width: auto;
  height: 316px;
  display: flex;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.brightGray};

  input {
    display: none;
  }

  button {
    background-color: ${({ theme }) => theme.colors.gray};
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 30px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const FormBottomStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;

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

export default AnnouncementForm;