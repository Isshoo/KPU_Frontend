import styled from 'styled-components';

const Avatar = styled.img.withConfig({
  shouldForwardProp: (prop) =>
    !['boxShadow'].includes(prop), // Filter properti
})`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  box-shadow: ${(props) => props.boxShadow};

  &.item-image {
    @media (max-width: 500px) {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

  &.detail-image {
    @media (max-width: 500px) {
      width: 3.75rem;
      height: 3.75rem;
    }
  }
    
  &.leaderboard-image {
    @media (max-width: 500px) {
      width: 2.75rem;
      height: 2.75rem;
    }
    @media (max-width: 368px) {
      width: 2.7rem;
      height: 2.7rem;
    }
  }
`;

Avatar.defaultProps = {
  width: '3.75rem',
  height: '3.75rem',
  boxShadow: '-2px 2px 5px 2px rgba(0, 0, 0, 0.2)',
};

export default Avatar;