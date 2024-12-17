import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Rating, CircularProgress } from '@mui/material';

const RatingDialog = ({ open, handleClose, handleSubmitReview, userRole, loading }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const onSubmit = () => {
    handleSubmitReview(review, rating);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>评价订单</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {userRole === 'buyer' ? '请评价卖家' : '请评价买家'}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="评价"
          type="text"
          fullWidth
          value={review}
          multiline
          onChange={(e) => setReview(e.target.value)}
        />
        <Rating
          name="rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          precision={0.5}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" sx={{ fontFamily: 'Noto Serif SC' }}>
          取消
        </Button>
        <Button onClick={onSubmit} color="primary" sx={{ fontFamily: 'Noto Serif SC' }} disabled={loading}>
          提交
        </Button>
        {loading &&
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 }} />}
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;