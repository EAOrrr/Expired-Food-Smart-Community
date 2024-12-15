import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import PropTypes from 'prop-types';

const CheckoutTable = ({ products }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>商品名称</TableCell>
            <TableCell>单价</TableCell>
            <TableCell>数量</TableCell>
            <TableCell>总价</TableCell>
          </TableRow>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>¥{product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>¥{product.price * product.quantity}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>总计</TableCell>
            <TableCell>¥{products.reduce((acc, product) => acc + product.price * product.quantity, 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
};
CheckoutTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CheckoutTable