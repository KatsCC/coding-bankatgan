import styled from '@emotion/styled';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Notification from './Notification';
import BarsIcon from '@/assets/icons/BarsIcon';
import logo from '../../../public/logo.png';
import useMemberStore from '@/store/useMemberStore';

interface HeaderProps {
  showAlert: (type: 'success' | 'error', message: string) => void;
}

const Header = ({ showAlert }: HeaderProps) => {
  const navigate = useNavigate();
  const { members } = useMemberStore();
  const [isManager, setIsManager] = useState(false);
  useEffect(() => {
    setIsManager(members[0]?.role === 'MANAGER');
  }, [members]);

  const handleReportClick = () => {
    if (!isManager) {
      showAlert('error', '권한이 없습니다.');
      setTimeout(() => 2000);
      return;
    }
    navigate('/report');
  };

  return (
    <HeaderLayout>
      <Logo onClick={() => navigate('/')}>
        <img src={logo} alt="오늘한잔" />
      </Logo>
      <MenuWrapper>
        <Notification />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BarsIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContentStyled>
            <DropdownMenuItem onClick={() => navigate('/announcement')}>공지사항</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/faq')}>FAQ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/specialty-drink')}>
              특산주 신청 리스트
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReportClick}>신고 접수 리스트</DropdownMenuItem>
          </DropdownMenuContentStyled>
        </DropdownMenu>
      </MenuWrapper>
    </HeaderLayout>
  );
};

const HeaderLayout = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 360px;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(114, 114, 114, 0.1) 0px 1px 5px;
  z-index: 50;
`;

const Logo = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100px;
  height: 30px;
  padding: 0px;

  img {
    width: 90px;
  }
`;

const MenuWrapper = styled.div`
  display: flex;

  svg {
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const DropdownMenuContentStyled = styled(DropdownMenuContent)`
  margin: 5px 1px 0 0;

  div {
    padding: 10px 0;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

export default Header;
