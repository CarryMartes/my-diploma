import PropTypes from 'prop-types';
// material
import { Grid, Stack, Typography } from '@mui/material';
import ShopProductCard from './ProductCard';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ products, subjectLink, ...other }) {
  return (
    <>
      <Grid container spacing={3} {...other}>
        {products.map((product, id) => (
          <Grid key={id} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} subjectLink={subjectLink} />
          </Grid>
        ))}
      </Grid>
      {products.length === 0 && (
        <Stack alignItems="center" marginTop="20px">
          <Iconify icon="icomoon-free:files-empty" />
          <Typography variant="subtitle2" gutterBottom fontWeight="normal" marginTop="20px">
            Empty subjects
          </Typography>
        </Stack>
      )}
    </>
  );
}
