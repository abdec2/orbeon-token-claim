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
                totalSupply: action.payload
            }
        
        case 'UPDATE_TOTAL_CLAIMED':
            return {
                ...state,
                tokenClaimed: action.payload
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