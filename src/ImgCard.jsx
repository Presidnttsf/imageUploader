import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ImgCard({image}) {
    
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image.imageUrl} alt={image.name} />
      <Card.Body>
        <Card.Title>{image.name}</Card.Title>
        <Card.Text>
          {image.email}
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default ImgCard;