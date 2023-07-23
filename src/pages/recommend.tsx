import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Recommend.module.css'
import { useRecommend } from '@/libs/api-hooks'
import { useEffect, useState } from 'react'
import { MovieData, FetchState } from '@/utils/types'
import MovieCard from '@/components/movie_card/MovieCard'
import { CircularProgress } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

const Recommend = () =>  {
  const [movies, fetchState, fetchItems] = useRecommend()

  useEffect(() => {
    fetchItems()
  }, [])
  return (
    <>
      <Head>
        <title>OMDB Browser - Recommendations</title>
        <meta name="description" content="Get movie recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        { 
          fetchState === FetchState.LOADING && (
          <>
            <CircularProgress />
          </>
        )}
          
        { 
          fetchState === FetchState.SUCCESS && (
          <>
            {
              movies.map((movie) => 
                <MovieCard 
                  key={movie.imdbID}
                  imdbID={movie.imdbID}
                  title={movie.Title}
                  year={movie.Year}
                  poster={movie.Poster}
                  type={movie.Type}
                />
              )
            }
          </>
        )}
      </main>
    </>
  )
}


// export async function getStaticProps() {
//   const [movie, fetchState, getMovieById] = useGetById();
  
  // const getIds = ():string[] => {
  //   let idArr:Array<string> = []

  //   for (let i = 0; i < 5; i++){
  //     let idNum: number = Math.floor(Math.random() * 10000000)
      
  //     let strIdNum: string = idNum.toString()
      
  //     while (strIdNum.length != 7) {
  //       strIdNum = '0'+strIdNum
  //     }
  //     idArr.push('tt'+strIdNum)
  //   }
  //   return idArr;
  // }

  // let ids:string[] = getIds();
  // let movies:Array<MovieData | undefined> = []

  // ids.forEach(id => {
  //   getMovieById(id)

  //   movies.push(movie)
  // });

//   return {
//     props: {
//       movies
//     }
//   }
// }

export default Recommend;