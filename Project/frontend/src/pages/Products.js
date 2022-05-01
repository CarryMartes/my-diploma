import { Formik, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductFilterSidebar } from '../sections/@dashboard/products';
//
import Iconify from 'src/components/Iconify';
import AddDialog from 'src/components/products/AddDialog';
import { userSubjects } from 'src/shared/api/request/subjects';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentSubject } from 'src/shared/store/subjects/actions';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [dialog, setDialog] = useState(false);
  const user = useSelector((state) => state.user['userProfile']);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  const handleDialogClose = () => {
    setDialog(false);
  };

  useEffect(() => {
    userSubjects({
      status: user.status
    }).then((res) => {
      setSubjects(res.subjects);
    });
  }, []);

  const subjectLink = (currentSubject) => {
    dispatch(setCurrentSubject(currentSubject));
    navigate(`/dashboard/repositories/${currentSubject.subject.id}`);
  };

  return (
    <Page title="Dashboard: Products">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Subjects
          </Typography>
          {user && user.status === 'teacher' && (
            <Button
              variant="contained"
              to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setDialog(true)}
            >
              Add subject
            </Button>
          )}
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={subjects} subjectLink={subjectLink} />

        <AddDialog dialog={dialog} handleDialogClose={handleDialogClose} />

        {/* <ProductCartWidget /> */}
      </Container>
    </Page>
  );
}
