import { useContext, useEffect, useRef, useState } from 'react';

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Input,
    Typography,
    Paper,
    Select,
    InputLabel,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import StakingDetail from 'components/cards/statistics/StakingDetails';
import ApyCard from 'components/cards/statistics/ApyCard';
import { styled } from '@mui/material/styles';
import TimeComponent from 'components/TimeComponent';
import { AlertMsg } from 'components/AlertMsg';
import claimAbi from './../../configs/claim.json';
import TokenAbi from './../../configs/token.json';
import { leafNodeOne } from 'configs/LeafNodeOne';
import { leafNodeTwo } from 'configs/LeafNodeTwo';
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');

// assets
import { GlobalContext } from 'context/GlobalContext';
import { CONFIG } from 'configs/config';
import { leafNodes } from './../../configs/config';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useAccountData from 'hooks/useAccountData';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from '../../../node_modules/wagmi/dist/index';
import { useDebounce } from 'usehooks-ts';
import { FormLabel } from '../../../node_modules/@mui/material/index';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// styles
const styles = {
    lockPeriod: {
        textAlign: 'center',
        fontFamily: 'Space Grotesk',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '20px'
    },
    timer: {
        color: '#F5331E',
        fontFamily: 'Space Grotesk',
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: '23px'
    },
    timeCat: {
        color: '#000515',
        lineHeight: '10px',
        fontSize: '12px',
        mt: 2
    },
    lockAmount: {
        textAlign: 'center',
        fontFamily: 'Space Grotesk',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '16px',
        color: '#000515',
        opacity: 0.7,
        mt: 3
    },
    selectBox: {
        width: '120px',
        padding: '6px 10px',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        background: '#e6e6e6',
        border: '1px solid #ccc'
    },
    stakeChartvalue: {
        fontFamily: 'Space Grotesk',
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: '30px'
    },
    txtInput: {
        border: '1px solid #C7C4C3',
        width: '100%',
        fontSize: '16px',
        fontFamily: 'Space Grotesk',
        padding: '18px 16px',
        background: '#e5e5e5',
        color: '#aaa',
        borderRadius: 0
    },
    btn: {
        width: '100%',
        bgcolor: '#F5331E',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        borderRadius: 0,
        color: '#fff',
        py: 1.8,
        px: 2,
        '&:hover': {
            bgcolor: '#ff7262'
        }
    },
    btn1: {
        width: '100%',
        bgcolor: '#e5e5e5',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        borderRadius: 0,
        border: '1px solid #000515',
        color: '#000515',
        py: 1.8,
        px: 2,
        '&:hover': {
            bgcolor: '#C7C8CC'
        }
    }
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

const Token = styled(Paper)(({ theme }) => ({
    background: '#ffffff',
    borderRadius: 0,
    padding: '12px',
    boxShadow: 'none',
    width: '100%'
}));

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState(0);
    const dAmount = useDebounce(amount, 500);
    const [proof, setProof] = useState('');
    const dProof = useDebounce(proof, 500);
    const [tree, setTree] = useState();
    const [tree2, setTree2] = useState();
    const [tree3, setTree3] = useState();
    const [claimToken, setClaimToken] = useState(0);
    const { data: signer } = useSigner();
    const { openConnectModal } = useConnectModal();
    const { blockchainData, updateLoading, fetchData } = useContext(GlobalContext);
    const [stage, setStage] = useState('');
    const ADDRESS = stage === "1" ? CONFIG.CONTRACT_ADDRESS_ONE : stage === "2" ? CONFIG.CONTRACT_ADDRESS_TWO : stage === "3" ? CONFIG.CONTRACT_ADDRESS_THREE : '';
   
    const { config, refetch: prepareContract } = usePrepareContractWrite({
        enabled: false,
        address:
            stage === 1
                ? CONFIG.CONTRACT_ADDRESS_ONE
                : stage === 2
                ? CONFIG.CONTRACT_ADDRESS_TWO
                : stage === 3
                ? CONFIG.CONTRACT_ADDRESS_THREE
                : '',
        abi: TokenAbi,
        functionName: 'Claim',
        args: [dAmount, dProof],
        overrides: {
            from: address
        }
    });
    const { data: claimData, write: claim } = useContractWrite(config);
    const { isLoading } = useWaitForTransaction({
        hash: claimData?.hash,
        onSuccess(data) {
            updateLoading(false);
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' });
            fetchData();
            refetchAccountData();
        },
        onError(err) {
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' });
        }
    });
    useEffect(() => {
        console.log('stage', stage);
        console.log("contract", ADDRESS);
    }, [stage]);
    const refetchAccountData = useAccountData();
    console.log(blockchainData);

    const handleClaim = async () => {
        try {
            if (!isConnected) {
                openConnectModal();
                return;
            }
            if (stage === '') {
                AlertMsg({ title: 'Oops!', msg: 'Please select a stage', icon: 'error' });
                return;
            }
            if (blockchainData.userData.claimed) {
                AlertMsg({ title: 'Oops!', msg: 'You have already claimed your ORBN', icon: 'error' });
                return;
            }

            const balance = leafNodes.filter((item) => item.address.toLowerCase() === address.toLowerCase());
            if (balance.length > 0) {
            } else {
                AlertMsg({ title: 'Oops!', msg: 'Connected wallet is not whitelisted', icon: 'error' });
                return;
            }

            await prepareContract();
            claim();
        } catch (e) {
            console.log(e);
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' });
        }
    };

    useEffect(() => {
        if (isLoading) {
            updateLoading(true);
        }
    }, [isLoading]);

    useEffect(() => {
        console.log('hi');
        if (stage === '0') {
            return;
        }
        if (stage === '1') {
            const arr = leafNodeOne.map((i) => {
                const packed = ethers.utils.solidityPack(
                    ['address', 'uint256'],
                    [i.address, ethers.utils.parseUnits(i.balance.toString(), CONFIG.ORBN_DECIMALS)]
                );
                return keccak256(packed);
            });

            const merkleTree = new MerkleTree(arr, keccak256, { sortPairs: true });
            setTree(merkleTree);
            const root = merkleTree.getHexRoot();

            console.log(root);
            address;
            if (isConnected) {
                const balance = leafNodeOne.filter((item) => item.address.toLowerCase() === address.toLowerCase());
                if (balance.length > 0) {
                    setClaimToken(balance[0].balance);
                    setAmount(ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS));
                    const packed = ethers.utils.solidityPack(
                        ['address', 'uint256'],
                        [balance[0].address, ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS)]
                    );
                    const proof = merkleTree.getHexProof(keccak256(packed));
                    console.log(proof);
                    setProof(proof);
                } else {
                    setClaimToken(0);
                }
            }
        } else if (stage === '2') {
            const arr = leafNodeTwo.map((i) => {
                const packed = ethers.utils.solidityPack(
                    ['address', 'uint256'],
                    [i.address, ethers.utils.parseUnits(i.balance.toString(), CONFIG.ORBN_DECIMALS)]
                );
                return keccak256(packed);
            });

            const merkleTree = new MerkleTree(arr, keccak256, { sortPairs: true });
            setTree2(merkleTree);
            const root = merkleTree.getHexRoot();

            console.log(root);
            address;
            if (isConnected) {
                const balance = leafNodeTwo.filter((item) => item.address.toLowerCase() === address.toLowerCase());
                if (balance.length > 0) {
                    setClaimToken(balance[0].balance);
                    setAmount(ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS));
                    const packed = ethers.utils.solidityPack(
                        ['address', 'uint256'],
                        [balance[0].address, ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS)]
                    );
                    const proof = merkleTree.getHexProof(keccak256(packed));
                    console.log(proof);
                    setProof(proof);
                } else {
                    setClaimToken(0);
                }
            }
        } else if (stage === '3') {
            const arr = leafNodes.map((i) => {
                const packed = ethers.utils.solidityPack(
                    ['address', 'uint256'],
                    [i.address, ethers.utils.parseUnits(i.balance.toString(), CONFIG.ORBN_DECIMALS)]
                );
                return keccak256(packed);
            });

            const merkleTree = new MerkleTree(arr, keccak256, { sortPairs: true });
            setTree3(merkleTree);
            const root = merkleTree.getHexRoot();

            console.log(root);
            address;
            if (isConnected) {
                const balance = leafNodes.filter((item) => item.address.toLowerCase() === address.toLowerCase());
                if (balance.length > 0) {
                    setClaimToken(balance[0].balance);
                    setAmount(ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS));
                    const packed = ethers.utils.solidityPack(
                        ['address', 'uint256'],
                        [balance[0].address, ethers.utils.parseUnits(balance[0].balance.toString(), CONFIG.ORBN_DECIMALS)]
                    );
                    const proof = merkleTree.getHexProof(keccak256(packed));
                    console.log(proof);
                    setProof(proof);
                } else {
                    setClaimToken(0);
                }
            }
        }
    }, [isConnected, address, stage]);

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={3.75} sx={{ paddingTop: '5px', mb: '10px' }}>
                {/* row 1 */}
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <StakingDetail
                        title="Total Supply"
                        count={new Intl.NumberFormat('en-US').format(
                            ethers.utils.formatUnits(blockchainData.totalSupply, CONFIG.ORBN_DECIMALS)
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <StakingDetail
                        title="Total Token Claimed"
                        count={new Intl.NumberFormat('en-US').format(
                            ethers.utils.formatUnits(blockchainData.tokenClaimed, CONFIG.ORBN_DECIMALS)
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <StakingDetail title="No of Tokens to be claimed" count={new Intl.NumberFormat('en-US').format(claimToken)} />
                </Grid>
            </Grid>
            <Grid
                container
                rowSpacing={4.5}
                columnSpacing={3.75}
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ height: '100%' }}
            >
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <MainCard>
                        <Grid container>
                            <Grid item xs={12} sx={{ px: 1, mb: 2, sm: { mb: 0 } }}>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                        Wallet Address
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            height: '2rem',
                                            mb: 1
                                        }}
                                    >
                                        <FormControl
                                            fullWidth
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: '.5rem',
                                                alignItems: 'center',
                                                mb: 1,
                                                '& .MuiInputBase-root': {
                                                    height: '3rem',
                                                    width: '12rem'
                                                }
                                            }}
                                        >
                                            <FormLabel>Select Stage</FormLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stage}
                                                onChange={(e) => {
                                                    setStage(e.target.value);
                                                }}
                                            >
                                                <MenuItem disabled value="">
                                                    Select your Stage
                                                </MenuItem>
                                                <MenuItem value="1">Stage One 10% claim</MenuItem>
                                                <MenuItem value="2">Stage Two 10% claim</MenuItem>
                                                <MenuItem value="3">Stage Three 80% claim</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <input
                                    disabled
                                    style={{ ...styles.txtInput }}
                                    value={isConnected ? address : ''}
                                    placeholder="0x000000000..."
                                />
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 1.2 }}>
                            <Grid item xs={12} sm={12} sx={{ px: 1, mb: 0.4, mt: 2.1 }}>
                                <Button sx={{ ...styles.btn }} onClick={handleClaim}>
                                    Claim your ORBN
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
};

export default DashboardDefault;
