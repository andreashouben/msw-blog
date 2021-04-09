import React from "react";

const Character = ({bio}) => {
    return (
        <>
            <img src={bio.img} alt={`${bio.name}`}/>
            <div>

                <span>Name: {bio.name}</span>
            </div>
            {/*<dt aria-label="status">Status:</dt>
        <dd>{bio.status}</dd>
         <dt>Species:</dt>
        <dd>{bio.species}</dd>
        <dt>Gender:</dt>
        <dd>{bio.male}</dd>
        <dt>Origin:</dt>
        <dd>{bio.origin}</dd> */}
        </>
    );

};

export default Character;
