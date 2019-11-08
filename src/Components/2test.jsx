const data = ['favorites', 'scores'];
data.map((piece) => {
  const dynamicProps = {
    toggleData,
    loadingState,
    boolean: piece,
    simplifyString,
  };
  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  dynamicProps[`acct${capitalize(piece)}`] = `acct${capitalize(piece)}`;
  piece.slice(0, -1);
  console.log(piece);
  dynamicProps[`delete${capitalize(piece)}`] = `delete${capitalize(piece)}`;
  console.log(dynamicProps);
})


