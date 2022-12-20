import React, { useEffect } from 'react';

function Child2() {
//  console.log('child 2 render');
//  return <div>Child2</div>;
useEffect(() => {
  const mouseMove = ()=> {
  console.log('mouse moved...');
  };

  document.addEventListener('mousemove', mouseMove);

  return () => {
    document.removeEventListener('mousemove', mouseMove);
  };
  }, []);

  return <div>Child2</div>;
}




