import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();
  // TODO SELECTED IMAGE URL STATE
  const [urlState, setUrlState] = useState('')

  // TODO FUNCTION HANDLE VIEW IMAGE
  const handleViewImage = (url: string) => {
    setUrlState(url);
    onOpen();
  }

  return (
    <>
      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={urlState}
      />
      <SimpleGrid
        columns={3}
        spacing={10}
      >
        {
          cards?.map(card => {
            return (
              <Card
                key={card.id}
                data={card}
                viewImage={(url) => handleViewImage(url)}
              />
            )
          })
        }
      </SimpleGrid>
    </>
  );
}

