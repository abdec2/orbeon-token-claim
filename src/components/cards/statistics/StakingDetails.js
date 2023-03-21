import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/StakingCard';
import { CornorRight } from 'components/icons'

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const StakingDetails = ({ color, title, count, percentage, isLoss, extra }) => (
    <MainCard sx={{mt:{xs: 1, sm:0}}}>
        <Stack spacing={0.5}>
            <Box sx={{display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                <CornorRight />
            </Box>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h4" color="inherit" sx={{color: "#000000", fontWeight: 700, fontSize: '24px', lineHeight: '31px'}}>
                        {count}
                    </Typography>
                </Grid>
                
            </Grid>
        </Stack>
        
    </MainCard>
);

StakingDetails.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

StakingDetails.defaultProps = {
    color: 'primary'
};

export default StakingDetails;
