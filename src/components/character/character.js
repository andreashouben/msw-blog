import React from "react";
import styled from "styled-components";

const Character = ({ bio }) => {
  const Image = styled.img`
    width: 250px;
  `;
  const Bio = styled.div`
    display: inline-block;
  `;
  const Label = styled.span``;

  return (
    <>
      <Image src={bio.image} alt={`${bio.name}`} />
      <Bio>
        <Label>Name: {bio.name}</Label>
        <Label>Status: {bio.status}</Label>
        <Label>Species: {bio.species}</Label>
        <Label>Gender: {bio.gender}</Label>
        <Label>Origin: {bio.origin.name}</Label>
      </Bio>
    </>
  );
};

export default Character;
