import React from "react";

const Character = ({ bio }) => {
  return (
    <>
      <img src={bio.img} alt={`${bio.name}`} />
      <dl>
        <dt aria-label="name">Name:</dt>
        <dd aria-labelledby="name">{bio.name}</dd>
        {/*<dt aria-label="status">Status:</dt>
        <dd>{bio.status}</dd>
         <dt>Species:</dt>
        <dd>{bio.species}</dd>
        <dt>Gender:</dt>
        <dd>{bio.male}</dd>
        <dt>Origin:</dt>
        <dd>{bio.origin}</dd> */}
      </dl>
    </>
  );
};

export default Character;
