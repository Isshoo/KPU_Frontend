import { useState } from 'react';

const useVisibility = (defaultValue = false) => {
  const [visbility, setVisibility] = useState(defaultValue);

  function onSetVisibility() {
    setVisibility((prevVisibility) => !prevVisibility);
  }

  return [visbility, onSetVisibility];
};

export default useVisibility;
