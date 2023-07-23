import { useState } from "react";
import { FetchState, MovieData, SearchData } from "@/utils/types";
import axios from "axios";
import { API_base, API_KEY } from "@/utils/constants";


export function useSearch() {
    const [fetchState, setFetchState] = useState(FetchState.DEFAULT)
    const [movie, setMovie] = useState<SearchData[]>([])

    const searchMovie = async (searchVal: string) => {
        try{
            setFetchState(FetchState.LOADING)

            const res = await axios.get(`${API_base}?s=${searchVal}&apikey=${API_KEY}`)
            const resData = res.data.Search as SearchData[]; 

            setMovie(resData)
            setFetchState(FetchState.SUCCESS)
        } catch{
            setFetchState(FetchState.ERROR)
        }
    }

    return [movie, fetchState, setFetchState, searchMovie] as const;
}


export function useRecommend() {
    const [movies, setMovies] = useState<MovieData[]>([])
    const [fetchState, setFetchState] = useState(FetchState.DEFAULT)

    const createId = ():string => {
        let idNum: number = Math.floor(Math.random() * 10000000)
          
        let strIdNum: string = idNum.toString()
        
        while (strIdNum.length != 7) {
          strIdNum = '0'+strIdNum
        }
        
        return 'tt'+strIdNum;
    }

    const getIds = ():Array<string> => {
        let idArr:Array<string> = []
    
        for (let i = 0; i < 5; i++){
          idArr.push(createId())
        }
        return idArr;
      }

    const fetchItems = async () => {
        let ids = getIds();
        let test:Array<MovieData> = []
        
        setFetchState(FetchState.LOADING)
        for(let i=0; i < ids.length; i++){
            
            try{
                let flag:boolean = true
                do {
                    const res = await axios.get(`${API_base}?i=${ids[i]}&apikey=${API_KEY}`)
                    const resData = res.data as MovieData;
                    
                    if (resData.Response === "False") {
                        let newId = createId()
                        ids[i] = newId
                    } else {
                        flag = false
                        
                        test = [...test, resData]
                    }
                } while (flag) 
            } catch{
                setFetchState(FetchState.ERROR)
            }
        }
        setMovies(test)
        setFetchState(FetchState.SUCCESS)
    }

    return [movies, fetchState, fetchItems] as const;
}