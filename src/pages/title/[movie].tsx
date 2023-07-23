import React from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next' 
import { MovieData } from "@/utils/types";
import axios from "axios";
import { API_base, API_KEY } from "@/utils/constants";
import Error from "next/error";
import styles from "@/styles/Movie.module.css"
import Image from "next/image";


export const getStaticPaths: GetStaticPaths = async () => {
    
    return {
      paths: [
        {params: {
            movie: 'tt1375666'
        }},
      ],
      fallback: 'blocking',
    }
}
  

export const getStaticProps: GetStaticProps<{movie: MovieData}> = async (context) => {
    const res = await axios.get(`${API_base}?i=${context.params?.movie}&plot=full&apikey=${API_KEY}`)
    const movie = res.data as MovieData; 

    return { props: { movie }}
}

export default function Movie({movie} : InferGetStaticPropsType<typeof getStaticProps>) {
    if (movie.Response === "False") return <Error statusCode={404} />
    


    return (
        <div className={styles.main}>
            <div className={styles.movie}>
                <div className={styles.poster}>
                    <div className={styles.imgContainer}>
                        <Image 
                            src = {movie.Poster}
                            alt = {movie.Title} 
                            fill={true}
                            style={{objectFit: "contain"}}
                            // quality={100}
                            // width={100}
                        />
                    </div>
                
                </div>
                <div className={styles.details}> 
                    <h2> { movie.Title } ({ movie.Year }) </h2>
                    <h4> { movie.Genre } </h4>
                    <div className={styles.ratings}>
                        <p>Ratings: </p>
                        {
                            movie.Ratings.map((rating) => 
                                <>
                                    <p> { rating.Source }: { rating.Value } </p>
                                </>       
                            )
                        }
                    </div>
                    <p>Languages: {movie.Language} </p>
                    <p>Runtime: { movie.Runtime } </p>
                </div>
                <div className={styles.credits}>
                    <div>
                        <h3>Driector:</h3>
                        <p> { movie.Director } </p>
                    </div>
                    <div>
                        <h3>Actors:  </h3>
                        <p>{ movie.Actors }</p>
                    </div>
                    <div>
                        <h3>Writer: </h3>
                        <p>{ movie.Writer } </p>
                    </div>
                    
                </div> 
            </div>
            <div className={styles.plot}>
                <h3>Plot:</h3>
                <p>
                    {movie.Plot}
                </p>
            </div>
        </div>
    )
}