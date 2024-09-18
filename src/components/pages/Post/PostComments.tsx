import styled from '@emotion/styled';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SendIcon from '@/assets/icons/SendIcon';
import WarningIcon from '@/assets/icons/WarningIcon';
import Pagination from './../../layout/Pagination';
import { useEffect, useState } from 'react';
import ExProfileImg from '@/assets/ExProfileImg';
import { fetchCommentsApi, fetchCommentWriteApi } from '@/api/postApi';
import dayjs from 'dayjs';

interface PostCommentsProps {
  postId: number;
}

interface Content {
  id: number;
  memberId: number;
  memberName: string;
  postId: number;
  content: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface PagenationInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 댓글 작성 API 호출 함수 */
const wirteComment = async (postId: number, content: string) => {
  try {
    const response = await fetchCommentWriteApi(postId, content);
    return response;
  } catch (err) {
    console.error('Error writing comment: ', err);
  }
};

const PostComments = ({ postId }: PostCommentsProps) => {
  const [comments, setComments] = useState<Content[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pagination, setPagination] = useState<PagenationInfo>({
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });

  /** 특정 게시글의 댓글 가져오는 함수 */
  const fetchComments = async (postId: number, page: number, size: number) => {
    const data = await fetchCommentsApi(postId, page, size);

    if (data) {
      setComments(prevComments => {
        const newComments = [...prevComments, ...data.content];
        // 댓글 ID를 기준으로 중복 제거
        const uniqueComments = Array.from(
          new Map(newComments.map(comment => [comment.id, comment])).values(),
        );
        return uniqueComments;
      });

      setPagination({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        size: size,
        number: page,
      });
    }
  };

  useEffect(() => {
    fetchComments(postId, pagination.number, pagination.size);
  }, [postId, pagination.number, pagination.size]);

  const handleAnonymousChange = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handlePageChange = (newPage: number) => {
    fetchComments(postId, newPage, pagination.size);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await wirteComment(postId, newComment);

      if (response) {
        const newCommentData = {
          ...response,
          id: Date.now(),
          memberName: isAnonymous ? '익명' : response.memberName,
        };

        setComments(prevComments => [newCommentData, ...prevComments]);
        setNewComment('');
        setIsAnonymous(false);
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  return (
    <CommentWrapper>
      <Write>
        <div>
          <Textarea
            placeholder="댓글을 작성해주세요."
            value={newComment}
            onChange={handleCommentChange}
          />
          <CheckBoxWrapper>
            <Checkbox id="other" checked={isAnonymous} onCheckedChange={handleAnonymousChange} />
            <label htmlFor="other">익명</label>
          </CheckBoxWrapper>
        </div>
        <Button onClick={handleCommentSubmit}>
          <SendIcon />
        </Button>
      </Write>
      <Comments>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment key={comment.id}>
              <ExProfileImg />
              <CommentInfoWrapper>
                <span>
                  <CommentNickname>{comment.memberName}</CommentNickname>
                  <CommentDate>{dayjs(comment.createdAt).format('YYYY.MM.DD')}</CommentDate>
                </span>
                <p>{comment.content}</p>
              </CommentInfoWrapper>
            </Comment>
          ))
        ) : (
          <NoComment>작성된 댓글이 없습니다</NoComment>
        )}
      </Comments>
      {comments.length > 0 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
      <ReportBtn>
        <WarningIcon /> 신고하기
      </ReportBtn>
    </CommentWrapper>
  );
};

const CommentWrapper = styled.section`
  width: 100%;
  min-height: 200px;
  height: auto;
  margin-top: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
`;

const Write = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  textarea {
    min-width: 230px;
    width: 100%;
    padding: 10px 10px 10px 70px;
    background-color: ${({ theme }) => theme.colors.clearGray};
    font-size: ${({ theme }) => theme.fontSizes.small};
    border-radius: 10px;
    resize: none;
    height: 40px;

    &:hover,
    &:focus {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusShadow};
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.primary};

    &:active,
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }

    svg {
      width: 18px;
      height: 18px;
      margin: 0;
      color: ${({ theme }) => theme.colors.white};
    }
  }

  > div {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const CheckBoxWrapper = styled.div`
  position: absolute;
  top: 18px;
  left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 !important;

  button {
    width: 16px;
    height: 16px;
    margin: 0 5px 0 0;
    background-color: ${({ theme }) => theme.colors.gray};

    svg {
      width: 14px;
      height: 14px;
    }
  }

  button[aria-checked='true'] {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  label {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 70px;
  height: auto;
  margin: 20px 0;
`;

const NoComment = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 10px;
`;

const Comment = styled.div`
  display: flex;
  width: 100%;
  min-height: 50px;
  height: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.clearGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  &:first-of-type {
    border-radius: 10px 10px 0 0;
  }

  &:last-of-type {
    border-bottom: 0;
    border-radius: 0 0 10px 10px;
  }

  svg {
    width: 26px;
    height: 26px;
    margin-right: 8px;
  }
`;

const CommentInfoWrapper = styled.div`
  width: 90%;

  > span {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const CommentNickname = styled.span`
  margin-right: 5px;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const CommentDate = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ReportBtn = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 30px 0 10px 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  svg {
    width: 16px;
    height: 16px;
    margin-right: 2px;
  }
`;

export default PostComments;
