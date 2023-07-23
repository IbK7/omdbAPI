import React from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import styles from './MovieCard.module.css'
import { useRouter } from 'next/router'


const inter = Inter({ subsets: ['latin'] })

interface IProps {
    title: string | undefined,
    year: string | undefined, 
    poster: string | undefined,
    type: string | undefined,
    imdbID: string | undefined,
}

const MovieCard:React.FC<IProps> = ({title, year, poster, type, imdbID}) => {
    const router = useRouter()

    return (
        <div className={[styles.container, inter.className].join(' ')}
            onClick={ () => {
                router.push(`/title/${imdbID}`)            
            }}
        >
            <div className={`${styles.imgContainer}`}>
                {
                    poster && poster !== 'N/A' && title ? (
                        <Image 
                            src = {poster}
                            alt = {title} 
                            fill={true}
                            style={{objectFit: "cover"}}
                            quality={100}
                        />
                    ) : null
                }
            </div>
            <div className={styles.details}>
                <h4>{title} ({ year }) </h4>
            </div>
        </div>
    )
}

export default MovieCard;