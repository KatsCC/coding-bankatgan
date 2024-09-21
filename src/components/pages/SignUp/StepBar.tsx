import styled from '@emotion/styled';
import { Progress } from '@/components/ui/progress';
import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';

interface ChangePageProps {
  prevSlide: () => void;
  progressValue: number;
  currentSlide: number;
}

const StepBar = ({ prevSlide, progressValue, currentSlide }: ChangePageProps) => {
  return (
    <ChangePageContainer>
      {currentSlide === 2 ? (
        <div className="arrow-container" onClick={prevSlide}>
          <ArrowLeftIcon />
        </div>
      ) : (
        <div className="arrow-container"></div>
      )}
      <ProgressStyled value={progressValue} />
    </ChangePageContainer>
  );
};

const ChangePageContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 5vh;
  margin: 20px 0 0 0;
  svg {
    color: ${({ theme }) => theme.colors.darkGray};
  }
  .arrow-container {
    width: 25px;
    height: 25px;
    transform: translateX(20px);
  }
`;

const ProgressStyled = styled(Progress)`
  width: 155px;
  height: 7px;
  margin: auto;
  div {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default StepBar;