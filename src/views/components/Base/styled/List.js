import styled from 'styled-components';

const List = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['paddingInline', 'paddingBlock', 'gutter'].includes(prop),
})`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: ${(props) => props.gutter};
  background-color: transparent;
  padding-inline: ${(props) => props.paddingInline};
  padding-block: ${(props) => props.paddingBlock};

  &.leaderboards-list {
    @media (max-width: 500px) {
      padding-inline: 0.25rem;
      padding-block: 1rem 3rem;
    }

    @media (max-width: 368px) {
      padding-inline: 0rem;
    }
  }
`;

List.defaultProps = {
  paddingInline: '0',
  paddingBlock: '0',
  gutter: '1.25rem',
};

export default List;