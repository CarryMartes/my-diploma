import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack
} from '@mui/material';

export default function withAddDialog(WrappedComponent) {
  function wrapped({ openUp, dialog, ...props }) {
    return (
      <Dialog
        open={dialog ? dialog : false}
        onClose={openUp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Fill the form '}</DialogTitle>
        <DialogContent>
          <WrappedComponent {...props} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={openUp} autoFocus>
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    );
  }
  return wrapped;
}
