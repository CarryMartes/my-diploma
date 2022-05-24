import {
  Container,
  Stack,
  Typography,
  Card,
  TableContainer,
  Table,
  TableBody,
  IconButton,
  TableRow,
  Button,
  TableCell,
  Checkbox
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import CustomButton from 'src/components/AddButton';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from 'src/sections/@dashboard/user';
import USERLIST from '../_mocks_/user';
import { getSubject } from 'src/shared/api/request/subjects';
import { useParams } from 'react-router-dom';
import { getRepositories } from 'src/shared/api/request/repos';
import SearchNotFound from 'src/components/SearchNotFound';
import AddDialog from 'src/components/repositories/AddDialog';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from 'src/shared/store/subjects/actions';

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'actions' }
];

const MENU_ITEMS = [
  {
    icon: 'carbon:add-alt',
    text: 'Add students',
    key: 'students',
    extra: {
      sx: { color: 'text.primary' }
    }
  },
  {
    icon: 'akar-icons:link-out',
    text: 'Open in github',
    key: 'github',
    extra: {
      sx: { color: 'text.primary' }
    }
  },
  {
    icon: 'eva:trash-2-outline',
    text: 'Delete',
    extra: {
      // component: { RouterLink },
      to: '#',
      sx: { color: 'red' }
    }
  }
];

const Repositories = () => {
  const [currentSubject, setCurrentSubject] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [currentOpened, setCurrentOpened] = useState(null);
  const { id } = useParams();

  const menu_items = useMemo(
    () =>
      MENU_ITEMS.map((item) => {
        switch (item.key) {
          case 'students':
            item.extra = {
              ...item.extra,
              onClick: () => {
                console.log('HII');
              }
            };
            break;
          case 'github':
            item.extra = {
              ...item.extra,
              onClick: (event) => {
                // eslint-disable-next-line no-undef
                window.open(`${process.env.REACT_APP_GITHUB_LINK + currentOpened.name}`, '_blank');
              }
            };
            break;
          default:
            break;
        }
        return item;
      }),
    [currentOpened]
  );

  const dispatch = useDispatch();

  const dialog = useSelector((state) => state.subject['dialog']);

  const openModal = () => {
    dispatch(
      openDialog({
        key: AddDialog.displayName,
        value: !dialog[AddDialog.displayName]
      })
    );
  };

  useEffect(() => {
    getSubject(id).then((res) => {
      setCurrentSubject(res);
    });
    getRepositories({ id }).then((res) => {
      setRepositories(res.repos);
    });
  }, []);

  const triggerRepositories = () => {
    getRepositories({ id }).then((res) => {
      setRepositories(res.repos);
    });
    openModal();
  };

  return (
    <Page title="Repostitories">
      <Container>
        <Stack alignItems="center" direction="row" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            {currentSubject && `${currentSubject.subject.name}s repositories`}
          </Typography>
          <CustomButton
            value="Add repository"
            events={{
              onClick: () => {
                openModal();
              }
            }}
          />
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  checkbox={false}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  onRequestSort={() => null}
                  numSelected={0}
                />
                <TableBody>
                  {repositories.map((row) => {
                    const { id, name, description } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell align="left">{id}</TableCell>
                        <TableCell align="left">
                          <Typography
                            variant="subtitle2"
                            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu
                            menuList={menu_items}
                            triggerOpen={() => {
                              setCurrentOpened(row);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {repositories.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound
                          searchQuery={''}
                          title=""
                          descr="The course repostiroty is empty"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      <AddDialog
        openUp={openModal}
        dialog={dialog[AddDialog.displayName]}
        id={id}
        triggerRepositories={triggerRepositories}
      />
    </Page>
  );
};
export default Repositories;
