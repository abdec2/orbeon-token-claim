import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useContractReads, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import claimABI from './../configs/claim.json'

const claimContract = {
    address: CONFIG.CONTRACT_ADDRESS,
    abi: claimABI,
}

const useAccountData = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateUserData } = useContext(GlobalContext)

    const { data, isLoading, isError, refetch } = useContractReads({
        contracts: [
            {
                ...claimContract,
                functionName: 'isClaimed',
                args: [address]
            }
        ], 
        enabled: false,
        onSuccess(data) {
            updateUserData({claimed: data[0]})
        }
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
    }, [isConnected, address])

    return refetch
}

export default useAccountData