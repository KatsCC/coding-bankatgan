import React, { useEffect, useState } from 'react';
import { ContentWrapper, NoFooterLayout } from '@/styles/CommonStyles';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import useAnnouncementStore from '@/store/useAnnouncementStore';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import PrevBtn from '../../layout/PrevBtn';
import EllipsisHorizontalIcon from '@/assets/icons/EllipsisHorizontalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AnnouncementDetail = () => {
  const navigate = useNavigate();
  const { announcements, fetchAnnouncementsDetail } = useAnnouncementStore();
  const { id } = useParams();
  const announcementId = Number(id);

  const location = useLocation();
  const newAnnouncement = location.state;

  useEffect(() => {
    fetchAnnouncementsDetail(announcementId);
  }, [fetchAnnouncementsDetail, announcementId]);

  const announcement =
    announcements.find(announcement => announcement.id === announcementId) || newAnnouncement;

  return (
    <NoFooterLayoutSub>
      <ContentWrapper>
        <OptionWrapper>
          <PrevBtn />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContentStyled>
              <DropdownMenuItem onClick={() => navigate('/')}>수정</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/')}>삭제</DropdownMenuItem>
            </DropdownMenuContentStyled>
          </DropdownMenu>
        </OptionWrapper>
        <HeaderStyled>
          <div>{announcement?.title}</div>
          <span>{dayjs(announcement?.createdAt).format('YYYY.MM.DD')}</span>
        </HeaderStyled>
        <Line />
        <BottomStyled>
          {announcement?.imageUrl ? <img src={announcement.imageUrl} alt="이미지 설명" /> : null}
          <TextareaStyled id="content" value={announcement?.content || ''} readOnly />
        </BottomStyled>
      </ContentWrapper>
    </NoFooterLayoutSub>
  );
};

const NoFooterLayoutSub = styled(NoFooterLayout)`
  align-items: flex-start;
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DropdownMenuContentStyled = styled(DropdownMenuContent)`
  margin: 5px 1px 0 0;

  div {
    padding: 10px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 10px;
  > div {
    display: block;
    white-space: wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
  > span {
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.gray};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const BottomStyled = styled.div`
  img {
    min-width: 150px;
    width: auto;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    margin-bottom: 10px;
    border: 1px solid ${({ theme }) => theme.colors.brightGray};
    overflow: hidden;
  }

  > button {
    &:focus {
      border-color: ${({ theme }) => theme.colors.focusShadow};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }
`;

const TextareaStyled = styled(Textarea)`
  height: 150px;
  margin-top: 5px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  resize: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.white};
  }
`;

export default AnnouncementDetail;