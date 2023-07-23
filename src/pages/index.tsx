import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Search.module.css'
import { useState } from 'react'
import MovieCard from '@/components/movie_card/MovieCard'
import { useSearch } from '@/libs/api-hooks'
import { FetchState } from '@/utils/types'
import { CircularProgress } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export default function Search() {
  const [search, setSearch] = useState<string>("")
  const [movies, fetchState, setFetchState, searchMovie] = useSearch()

  const getSearchResults = () => {
    if(search === '') {
      setFetchState(FetchState.DEFAULT)
    } else {
      searchMovie(search)
    }
  }

  return (
    <>
      <Head>
        <title>OMDB Browser - Search</title>
        <meta name="description" content="Search the OMDB database." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {/* Div that contains the Input field for search value */}
        <div id='SearchDiv' className={`${styles.searchDiv}`}>
          <input 
            className={`${styles.input}`} 
            type='text'  
            placeholder='Search...'
            value={search}
            onChange={
              (event) => {setSearch(event.target.value)}
            }
          />

          <div className={styles.button}
            onClick={getSearchResults}
          >
              Search
          </div>
        </div>
        {/* Div that will show the results of the search */}
        <div className={styles.searchResult}>
          {
          fetchState === FetchState.DEFAULT && (
            <>
              <p>Search Results will show here.</p>
            </>
          )}
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
                      key = {movie.imdbID}
                      imdbID={movie.imdbID}
                      title={movie.Title} 
                      year={movie.Year} 
                      type={movie.Type}
                      poster={movie.Poster}
                    />
                  )
              }
            </>
          )}
          
        </div>

      </main>
    </>
  )
}

