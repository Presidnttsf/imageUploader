import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ImgCard({image, deleteImage, index}) {
    
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image.imageUrl} alt={image.name} />
      <Card.Body>
        <Card.Title>{image.name}</Card.Title>
        <Card.Text>
          {image.email}
        </Card.Text>
        <Button variant="primary">{index+1}</Button>
      </Card.Body>
      <button 
  type="button"  
  onClick={()=>deleteImage(image._id)}
  className="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2 border-0 bg-transparent"
>
  ✖
</button>

    </Card>
  );
}

export default ImgCard;