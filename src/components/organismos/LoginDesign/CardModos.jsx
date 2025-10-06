import styled from "styled-components";
export function CardModos({ title, subtitle, img, bgcolor, funcion }) {
  return (
    <Container $bgcolor={bgcolor} onClick={funcion}>
      <section className="card-container">
        <article className="content-wrapper">
          <section className="badge-container">
          
            <span className="badge-button">{title} </span>
          </section>
          <section className="title-section">
            <span className="subtitle">{subtitle} </span>
          </section>
        </article>
        <article className="image-container">
          <img
            className="character-image"
            src={img}
            alt="My Hero Academia character"
          />
        </article>
      </section>
    </Container>
  );
}
const Container = styled.section`
  overflow: hidden;
  .card-container {
    cursor: pointer;
    position: relative;
    background: ${(props) => props.$bgcolor};
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    gap: 1.25rem;
    &:hover {
      background-color: rgba(23, 23, 23, 1);
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
  }

  .badge-container {
    background-color: #fff0e6;
    color: ${(props) => props.$bgcolor};
    border-radius: 8px;
    padding: 0.25rem 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .badge-button {
    font-weight: bold;
  }

  .title-section {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: bold;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
  }

  .image-container {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: flex-end;
    height: 60px;
  }

  .character-image {
    height: 100%;
    position: relative;
  }
`;