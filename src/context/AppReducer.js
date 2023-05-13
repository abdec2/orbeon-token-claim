export const AppReducer = (state, action) => {
    switch(action.type) {
        case 'UPDATE_NO_OF_USERS':
            return {
                ...state,
                noOfUsers: action.payload
            }
        case 'UPDATE_TOTAL_SUPPLY':
            return {
                ...state,
                contract1: {
                    ...state.contract1,
                    totalSupply: action.payload
                }, 
                contract2: {
                    ...state.contract2,
                    totalSupply: action.payload
                },
                contract3: {
                    ...state.contract3,
                    totalSupply: action.payload
                },
            }
        
        case 'UPDATE_TOTAL_CLAIMED':
            return {
                ...state,
                contract1: {
                    ...state.contract1,
                    tokenClaimed: action.payload.claimed1
                }, 
                contract2: {
                    ...state.contract2,
                    tokenClaimed: action.payload.claimed2
                },
                contract3: {
                    ...state.contract3,
                    tokenClaimed: action.payload.claimed3
                },
            }

        case 'UPDATE_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'UPDATE_USER_DATA':
            return {
                ...state,
                userData: action.payload
            }

        default:
            return state;
    };
}