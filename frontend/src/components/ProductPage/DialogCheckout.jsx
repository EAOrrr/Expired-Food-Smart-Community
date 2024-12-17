import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
import CheckoutTable from "../CheckoutTable";

const DialogCheckout = ({ open, handleClose, handleConfirmPurchase, confirmDisabled, product, count }) => (

  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>账单确认</DialogTitle>
    <DialogContent>
      <CheckoutTable products={[{ ...product, quantity: count }]} />
      {confirmDisabled && (
        <CircularProgress
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>取消</Button>
      <Button onClick={handleConfirmPurchase} disabled={confirmDisabled}>确认</Button>
    </DialogActions>
  </Dialog>
);

export default DialogCheckout;
