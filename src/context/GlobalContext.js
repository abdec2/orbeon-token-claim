import { createContext, useEffect, useReducer } from "react";
import { AppReducer } from './AppReducer'
import { useContractReads } from "wagmi";
import { CONFIG } from '../configs/config'
import tokenAbi from './../configs/token.json'
import claimAbi from './../configs/claim.json'

const orbnContract = {
    address: CONFIG.ORBN_ADDRESS,
    abi: tokenAbi,
}

const claimContract = {
    address: CONFIG.CONTRACT_ADDRESS,
    abi: claimAbi,
}


const initialState = {
    loading: false,
    noOfUsers: 0,
    tokenClaimed: 0,
    totalSupply: 0, 
    userData: {
        claimed: false,
        whitelisted: false
    }
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)
    const { data, isError, isLoading, refetch } = useContractReads({
        contracts: [
            {
                ...orbnContract,
                functionName: 'totalSupply',
            }, 
            {
                ...claimContract,
                functionName: 'totalClaimed',
            }
        ],
        onSuccess(data) {
            updateTotalSupply(data[0].toString())
            updateTotalClaimed(data[1].toString())
        },
    })

    const updateNoOfUser = (users) => {
        dispatch({
            type: 'UPDATE_NO_OF_USERS',
            payload: users
        })
    }

    const updateTotalSupply = (totalSupply) => {
        dispatch({
            type: 'UPDATE_TOTAL_SUPPLY',
            payload: totalSupply
        })
    }

    const updateTotalClaimed = (claimed) => {
        dispatch({
            type: 'UPDATE_TOTAL_CLAIMED',
            payload: claimed
        })
    }

    const updateLoading = (loading) => {
        dispatch({
            type: 'UPDATE_LOADING',
            payload: loading
        })
    }

    const updateUserData = (data) => {
        dispatch({
            type: 'UPDATE_USER_DATA',
            payload: data
        })
    }

    const fetchData = () => {
        refetch()
    }

    useEffect(() => {
       if(isLoading) {
        updateLoading(true)
       } else if(!isLoading) {
        updateLoading(false)
       }
    }, [isLoading])

    return (
        <GlobalContext.Provider value={
            {
                blockchainData: state,
                updateNoOfUser,
                updateTotalSupply,
                updateTotalClaimed,
                updateLoading,
                updateUserData,
                fetchData
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}