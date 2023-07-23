import { readFileSync, writeFileSync } from 'fs';
import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Recommend.module.css'
import { useEffect } from 'react'
import { MovieData } from '@/utils/types'
import MovieCard from '@/components/movie_card/MovieCard'
import { join } from 'path';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import axios from "axios";
import { API_base, API_KEY } from "@/utils/constants";


const inter = Inter({ subsets: ['latin'] })

// Function to use server side rendering for the file read and write 
// so that the recommendations can be same for the day.
export const getServerSideProps: GetServerSideProps = async () => {
  //function to generate a random imdb id for a recommendation
  const createId = ():string => {
    let idNum: number = Math.floor(Math.random() * 10000000)
      
    let strIdNum: string = idNum.toString()
    
    while (strIdNum.length != 7) {
      strIdNum = '0'+strIdNum
    }
    
    return 'tt'+strIdNum;
  }

// function to create an array of 5 ids
  const getIds = ():Array<string> => {
    let idArr:Array<string> = []

    for (let i = 0; i < 5; i++){
      idArr.push(createId())
    }
    return idArr;
  }

  // logic to check if the recommedation for the day have expired
  const allContents:string = readFileSync(join(__dirname, '/../../../src/recommend.txt'), 'utf-8');
  
  const lines = allContents.split('\n')
  const file_date = lines[0]
  const current = new Date();
  const current_date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  
  let movies:Array<MovieData> = []

  // if (date in file == today's date) -> change recommendations
  // else -> fetch ids from file and 
  if (file_date.trim() !== current_date.trim()) {
    let ids = getIds();

    for(let i=0; i < ids.length; i++){
      let flag:boolean = true
      do {
          const res = await axios.get(`${API_base}?i=${ids[i]}&apikey=${API_KEY}`)
          const resData = res.data as MovieData;
          
          if (resData.Response === "False") {
            let newId = createId()
            ids[i] = newId
          } else {
            flag = false
            
            movies = [...movies, resData]
          }
      } while (flag) 
    }

    let ids_str:string = `${current_date}\n${ids[0]}\n${ids[1]}\n${ids[2]}\n${ids[3]}\n${ids[4]}\n`
    writeFileSync(join(__dirname, '/../../../src/recommend.txt'), ids_str, {
      flag: 'w'
    } )
  } else {
    const ids = [lines[1],lines[2],lines[3],lines[4],lines[5]]

    for(let i=0; i < ids.length; i++){
      let flag:boolean = true
      do {
          const res = await axios.get(`${API_base}?i=${ids[i]}&apikey=${API_KEY}`)
          const resData = res.data as MovieData;
          
          if (resData.Response === "False") {
            let newId = createId()
            ids[i] = newId
          } else {
            flag = false
            
            movies = [...movies, resData]
          }
      } while (flag) 
    }
  }

  return { props: { movies: movies } }
}

const Recommend = ({movies}: InferGetServerSidePropsType<typeof getServerSideProps>) =>  {

  useEffect(() => {
    console.log(movies)
  })
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
          (movies as Array<MovieData>).map((movie) => 
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
      </main>
    </>
  )
}

export default Recommend;
