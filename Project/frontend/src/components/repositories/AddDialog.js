// material
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import withAddDialog from '../global/AddDialogHOC';
import * as Yup from 'yup';
import { addRepository } from 'src/shared/api/request/repos';

function AddDialog({ id, triggerRepositories }) {
  const [loading, setLoading] = useState(false);
  const FormSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name required')
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: ''
    },
    validationSchema: FormSchema,
    onSubmit: function () {
      submitRepository();
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const submitRepository = () => {
    setLoading(true);
    addRepository({
      ...formik.values,
      id
    })
      .then((res) => {
        triggerRepositories();
      })
      .finally(() => setLoading(false));
  };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Stack spacing={3} width="400px" marginTop="10px" justifyContent="right">
          <TextField
            variant="outlined"
            label="Name"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            {...getFieldProps('description')}
            multiline
            rows={4}
            variant="outlined"
            label="Description"
          />
          <Stack alignItems="end">
            <LoadingButton loading={loading} sx={{ maxWidth: '200px' }} onClick={submitRepository}>
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

AddDialog.displayName = 'repostiroyAddDialog';

export default withAddDialog(AddDialog);
