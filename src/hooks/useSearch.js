import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearch = (initialKeyword = '') => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(() => {
    return searchParams.get('keyword') || initialKeyword;
  });

  const onKeywordChangeHandler = (newKeyword) => {
    setKeyword(newKeyword);
    setSearchParams({ keyword: newKeyword });
  };

  return [keyword, onKeywordChangeHandler];
};

export default useSearch;
