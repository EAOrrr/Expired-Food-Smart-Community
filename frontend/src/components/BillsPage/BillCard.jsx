import { Card, CardContent, Typography, Box } from "@mui/material"

const operations = {
  'deposit': '存款',
  'payment': '付款',
  'income': '收入',
  'refund': '退款',
}

const BillCard = ({ bill }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 1, borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontFamily='Noto Serif SC'>金额: {bill.amount}</Typography>
        <Typography variant="body1" gutterBottom fontFamily='Noto Serif SC'>操作: {operations[bill.operation]}</Typography>
        <Typography variant="body2" color="textSecondary" fontFamily='Noto Serif SC'>创建时间: {new Date(bill.createdAt).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  )
}

export default BillCard