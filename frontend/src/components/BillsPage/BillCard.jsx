import { Card, CardContent, Typography } from "@mui/material"

const operations = {
  'deposit': '存款',
  'payment': '付款',
  'income': '收入',
  'refund': '退款',
}

const BillCard = ({ bill }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h6">金额: {bill.amount}</Typography>
        <Typography variant="body1">操作: {operations[bill.operation]}</Typography>
        <Typography variant="body2" color="textSecondary">创建时间: {new Date(bill.createdAt).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  )
}

export default BillCard