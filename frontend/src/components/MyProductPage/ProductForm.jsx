import { Box, TextField, Button, Grid, Grid2 } from "@mui/material"
import { useField } from "../../hooks"
import { useEffect, useState } from "react"
import Picture from "./Picture"

const ProductForm = ({ product, onSubmit }) => {
  const name = useField('商品名称', 'text', product ? product.name : '')
  const description = useField('商品描述', 'text', product ? product.description : '')
  const price = useField('价格', 'number', product ? product.price : '')
  const stock = useField('库存', 'number', product ? product.stock : '')
  const expiryDate = useField('有效期', 'date', product ? product.expiryDate.split('T')[0] : '')

  const [existingImages, setExistingImages] = useState(product ? product.Images.filter(img => !img.isCover) : [])
  const [deletedImages, setDeletedImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const [cover, setCover] = useState(null)
  const [coverPreview, setCoverPreview] = useState(product && product.Images
    ? (product.Images.find(img => img.isCover)
      ? `/api/images/${product.Images.find(img => img.isCover).imageId}`
      : null)
    : null
  )

  useEffect(() => {
    if (product) {
      setCoverPreview(product.Images && product.Images.find(img => img.isCover) 
        ? `/api/images/${product.Images.find(img => img.isCover).imageId}`
        : null
      )
      setExistingImages(product.Images 
        ? product.Images.filter(img => !img.isCover)
        : []
      )
    }
  }, [product])

  const handleCoverChange = (event) => {
    const file = event.target.files[0]
    setCover(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files)
    setNewImages([...newImages, ...files])
  }

  const handleDeleteExistingImage = (imageId) => {
    setExistingImages(existingImages.filter(img => img.imageId !== imageId))
    setDeletedImages([...deletedImages, imageId])
  }

  const handleDeleteNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('description', description.value)
    formData.append('price', price.value)
    formData.append('stock', stock.value)
    formData.append('expiryDate', expiryDate.value)
    if (cover) {
      formData.append('cover', cover)
    }
    newImages.forEach(image => {
      formData.append('', image)
    })
    formData.append('deletedImages', JSON.stringify(deletedImages))
    onSubmit(formData)
  }

  
  console.log(product)
  console.log(cover)
  console.log(newImages)
  console.log(coverPreview)
  return (
    <>
    <Box component='form' onSubmit={handleSubmit}>
      <TextField {...name} fullWidth margin="dense"/>
      <TextField {...description} fullWidth margin="dense" multiline/>
      <TextField {...price} fullWidth margin="dense"/>
      <TextField {...stock} fullWidth margin="dense"/>
      <TextField {...expiryDate} fullWidth margin="dense" />
      
      {/* Cover Image Section */}
      {coverPreview && (
        <Picture imageUrl={coverPreview} handleDelete={() => {
          setCover(null)
          setCoverPreview(null)
        }} />
      )}
      <Button variant="contained" component="label">
        上传封面
        <input type="file" hidden onChange={handleCoverChange} />
      </Button>

      {/* Other Images Section */}
      <Grid2 container spacing={2} style={{ marginTop: '10px' }}>
        {existingImages.map((img) => (
          <Grid2 item xs={3} key={img.imageId}>
            <Picture imageUrl={`/api/images/${img.imageId}`} handleDelete={() => handleDeleteExistingImage(img.imageId)} />
          </Grid2>
        ))}
        {newImages.map((file, index) => (
          <Grid2 item xs={3} key={index}>
            <Picture imageUrl={URL.createObjectURL(file)} handleDelete={() => handleDeleteNewImage(index)} />
          </Grid2>
        ))}
      </Grid2>
      <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
        上传图片 (最多8张)
        <input type="file" hidden multiple onChange={handleImagesChange} />
      </Button>
      <Button type="submit" style={{ marginTop: '10px' }}>提交</Button>
    </Box>
    </>
  )
}

export default ProductForm

