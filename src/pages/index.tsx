import { Flex, Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';


type Card = {
  title: string;
  description: string;
  url: string;
  ts: string;
  after: string;
}

export default function Home(): JSX.Element {
  //const fetchingData = async ({ pageParam = 0 }) => await api.get('/api/images?after=' + pageParam)
  const fetchingData = async () => await api.get('/api/images');
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchingData
    ,
    // TODO GET AND RETURN NEXT PAGE PARAM
    { getNextPageParam: (pages) => (pages.data.after ? pages.data.pageParam = pages.data.after : pages.data.pageParam = null) }

  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const flatDataArray = data?.pages.map((page) => {
      return page.data.data.map((image) => {
        return ({
          title: image.title,
          description: image.description,
          url: image.url,
          id: image.id,
          ts: image.ts,
        })
      })
    }).flat()
    return flatDataArray;
  }, [data]);
  /*
    const formattedData =
      [{ "title": "Chuacka", "description": "Africa", "url": "https://i.ibb.co/SPM6NPs/africa.jpg", "ts": 1627643320800000, "id": "305538762846241347" },
      { "title": "Otawwa", "description": "Canada", "url": "https://i.ibb.co/bP210dX/ottawa.jpg", "ts": 1627643829450000, "id": "305539296094323269" },
      { "title": "Athenas", "description": "Grecia", "url": "https://i.ibb.co/ngrb27T/athenas.jpg", "ts": 1627927500857000, "id": "305836747071160899" },
      { "title": "Milan", "description": "Italia", "url": "https://i.ibb.co/2MjkSRw/milan-italy.jpg", "ts": 1627927546762000, "id": "305836795194507845" }, { "title": "Sydney", "description": "Australia", "url": "https://i.ibb.co/hH3TNpx/sydney.jpg", "ts": 1627927569510000, "id": "305836819197461060" },
      { "title": "Orlando", "description": "USA", "url": "https://i.ibb.co/LQJ2r78/Orlando.jpg", "ts": 1627927625150000, "id": "305836877564346948" }
      ]
  */
  return (
    <>
      {
        // TODO RENDER LOADING
        isLoading ? (<Loading />)
          :
          // TODO RENDER ERROR SCREEN
          isError && (<Error />)
      }
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {
          hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              colorScheme="orange"
            >
              {isFetchingNextPage
                ? 'Carregando...'
                : hasNextPage && 'Carregar mais'
              }
            </Button>
          )
        }
      </Box>
    </>
  );
}
