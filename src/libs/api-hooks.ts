import { useState } from "react";
import { FetchState, SearchData } from "@/utils/types";
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
