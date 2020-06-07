import React, { Component } from 'react';

import { Container, TypeTitle, TypeDescription, TypeImage, RequestButton, RequestButtonText } from './styles';

import uberx from '../../assets/uberx.png';

export default function Details({ duration, distance }) {
  const baseTax = 0.90;
  const minTax = 2.50;
  const valuePerMinute = 0.09;
  const valuePerKM = 0.59;

  return(
    <Container>
      <TypeTitle>Popular</TypeTitle>
      <TypeDescription>Viagens baratas para o dia a dia</TypeDescription>

      <TypeImage source={uberx} />
      <TypeTitle>UberX</TypeTitle>
      <TypeDescription>{(baseTax+minTax+(duration*valuePerMinute)+(distance*valuePerKM)).toFixed(2)}€</TypeDescription>

      <RequestButton onPress={() => {}}>
        <RequestButtonText>SOLICITAR UBERX</RequestButtonText>
      </RequestButton>
    </Container>
  );
}