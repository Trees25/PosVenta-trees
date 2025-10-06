import styled from "styled-components";

export const CardFuncion = ({ top, bottom, left, right,title,imagen,bgcontentimagen,subtitle }) => {
  return (
    <Card $bottom={bottom} $top={top} $left={left} $right={right} >
      <CardIcon $bgcontentimagen={bgcontentimagen}>
        <img
          src={imagen}
          alt="Ahorra con Wardaditos"
        />
      </CardIcon>
      <CardText>
        <CardTitle>{title} </CardTitle>
        <CardDescription>{subtitle} </CardDescription>
      </CardText>
      <Badge $bgcontentimagen={bgcontentimagen}></Badge>
    </Card>
  );
};

const Card = styled.div`
width:220px;
height:50px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  gap: 15px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top:${(props)=>props.$top};
  bottom:${(props)=>props.$bottom};
  left:${(props)=>props.$left};
  right:${(props)=>props.$right};
  transition:all 0.3s ease-in-out;
  &:hover{
    transform:translateX(20px) translateY(2px) ;
  }
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props)=>props.$bgcontentimagen};
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color:#000;
`;

const CardDescription = styled.p`
  font-size: 14px;
  margin: 5px 0 0;
  color: #666;
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props)=>props.$bgcontentimagen};
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
`;
