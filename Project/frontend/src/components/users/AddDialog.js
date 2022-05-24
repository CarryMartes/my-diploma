// material
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import withAddDialog from '../global/AddDialogHOC';
import * as Yup from 'yup';
import { addRepository } from 'src/shared/api/request/repos';
import { addSubjects } from 'src/shared/api/request/subjects';
import { addStudents } from 'src/shared/api/request/students';

function AddDialog({ triggerUsers, users, repositories }) {
  const [selected, setSelected] = useState(false);
  const [repoSelected, setSelectedRepo] = useState([]);
  const FormSchema = Yup.object().shape({
    // name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name required')
  });
  const formik = useFormik({
    initialValues: {},
    validationSchema: FormSchema,
    onSubmit: function () {
      submitRepository();
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  const submitRepository = () => {
    const data = {
      students: selected,
      repositories: repoSelected
    };
    addStudents(data).then((res) => {
      console.log(res);
    });
    triggerUsers();
  };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Stack spacing={3} width="400px" marginTop="10px" justifyContent="right">
          <Stack alignItems="end">
            {repositories && (
              <Autocomplete
                id="combo-box-demo"
                options={repositories}
                multiple
                sx={{ width: '100%', marginTop: '20px' }}
                getOptionLabel={(result) => `${result.value}`}
                onChange={(_, value) => {
                  setSelectedRepo(value);
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography>{option.name}</Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Repostiory name"
                    id="github_username"
                    {...getFieldProps('nickname')}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>
                    }}
                  />
                )}
              />
            )}
            {users && (
              <Autocomplete
                id="combo-box-demo"
                options={users}
                multiple
                sx={{ width: '100%', marginTop: '20px' }}
                getOptionLabel={(result) => `${result.value}`}
                onChange={(_, value) => {
                  setSelected(value);
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography>ID: {option.value}</Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose student id"
                    id="github_username"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>
                    }}
                  />
                )}
              />
            )}
            <LoadingButton
              loading={isSubmitting}
              sx={{ maxWidth: '200px', marginTop: '20px' }}
              onClick={submitRepository}
            >
              Add students
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

AddDialog.displayName = 'addStudentsDialog';

export default withAddDialog(AddDialog);
